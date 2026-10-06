// 블로그 modules.data의 클라이언트 동기 간선(module_dependencies)마다, 가져오는 쪽 소스를 파싱해
// 그 간선이 정적 import로 생겼는지 require()로 생겼는지 판정한다.
import {readFile, realpath, writeFile} from 'node:fs/promises'
import {createRequire} from 'node:module'
import {dirname, resolve} from 'node:path'

import {parse} from '@babel/parser'

import {decodeModulesData} from './modules-data.mjs'

const [input, projectRoot, output] = process.argv.slice(2)
const {header, lists} = decodeModulesData(await readFile(input))
const isClient = (m) => /\[(?:app-)?client\]/.test(m.ident)
const toDisk = (path) => (path.startsWith('[project]/') ? resolve(projectRoot, path.slice('[project]/'.length)) : null)

function sites(code, filename) {
  const ast = parse(code, {
    sourceType: 'unambiguous',
    sourceFilename: filename,
    errorRecovery: true,
    plugins: ['jsx', 'typescript', 'decorators-legacy', 'importAttributes'],
  })
  const found = []
  const visit = (node) => {
    if (!node || typeof node !== 'object') return
    if (['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(node.type) && node.source)
      found.push({kind: 'import', spec: node.source.value})
    else if (node.type === 'ImportExpression' || (node.type === 'CallExpression' && node.callee?.type === 'Import'))
      found.push({kind: 'dynamic', spec: (node.source || node.arguments?.[0])?.value})
    else if (node.type === 'CallExpression' && node.callee?.type === 'Identifier' && node.callee.name === 'require')
      found.push({kind: 'require', spec: node.arguments[0]?.value})
    for (const [key, value] of Object.entries(node)) {
      if (key === 'loc' || key === 'start' || key === 'end' || key === 'extra' || key === 'comments') continue
      if (Array.isArray(value)) value.forEach(visit)
      else if (value && typeof value === 'object') visit(value)
    }
  }
  visit(ast.program)
  return found.filter((s) => typeof s.spec === 'string')
}

const parsed = new Map()
async function sitesOf(file) {
  if (!parsed.has(file)) {
    parsed.set(
      file,
      readFile(file, 'utf8')
        .then((code) => sites(code, file))
        .catch(() => null),
    )
  }
  return parsed.get(file)
}

async function resolveFrom(importer, spec) {
  try {
    return await realpath(createRequire(importer).resolve(spec))
  } catch {
    return null
  }
}

const counts = {}
const samples = {}
const byImporter = {}
const seen = new Set()
for (const [from, to] of lists.module_dependencies) {
  const a = header.modules[from],
    b = header.modules[to]
  if (!isClient(a) || !isClient(b)) continue
  const importer = toDisk(a.path),
    target = toDisk(b.path)
  // 같은 파일의 부분 모듈(<locals> 등)끼리 잇는 간선과 중복 경로 쌍은 한 번만 센다
  const key = `${a.path} -> ${b.path}`
  if (a.path === b.path || seen.has(key)) continue
  seen.add(key)
  let verdict
  if (!importer || !target || !/\.[cm]?[jt]sx?$/.test(importer)) verdict = 'not-parsable'
  else {
    const list = await sitesOf(importer)
    if (!list) verdict = 'not-parsable'
    else {
      const targetReal = await realpath(target).catch(() => target)
      const kinds = new Set()
      for (const site of list) if ((await resolveFrom(importer, site.spec)) === targetReal) kinds.add(site.kind)
      verdict = kinds.size ? [...kinds].sort().join('+') : list.some((s) => s.kind === 'require') ? 'unresolved (importer has require)' : 'unresolved (import only)'
    }
  }
  counts[verdict] = (counts[verdict] || 0) + 1
  const where = a.path.includes('/node_modules/') ? 'node_modules' : 'workspace'
  byImporter[where] ||= {}
  byImporter[where][verdict] = (byImporter[where][verdict] || 0) + 1
  ;(samples[verdict] ||= []).length < 8 && samples[verdict].push(key.replaceAll(/\[project\]\/node_modules\/\.pnpm\/[^/]+\/node_modules\//g, ''))
}
const report = {input, totalClientPairs: seen.size, counts, byImporter, samples}
console.log(JSON.stringify(report, null, 2))
if (output) await writeFile(output, JSON.stringify(report, null, 2))

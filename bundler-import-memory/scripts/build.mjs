// 같은 픽스처를 webpack, Turbopack(Next), Vite(Rolldown), esbuild로 빌드하고
// 각 번들러가 내보내는 그래프 정보와 산출물을 results/ 아래에 그대로 저장한다.
import {execFileSync} from 'node:child_process'
import {cp, mkdir, readFile, readdir, rm, writeFile} from 'node:fs/promises'
import {join, relative} from 'node:path'
import {fileURLToPath} from 'node:url'

import * as esbuild from 'esbuild'
import {build as viteBuild} from 'vite'
import webpack from 'webpack'

import {decodeModulesData} from './modules-data.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const results = join(root, 'results')
const nextBin = join(root, 'node_modules/next/dist/bin/next')

// auto: type 필드 없는 package.json, module: "type": "module"인 package.json,
// strict: auto에서 CJS 파일과 부수 효과 파일 맨 앞에 'use strict'만 붙인 것(webpack concatenation 확인용)
async function prepareFixture(pkgType) {
  const dir = join(root, 'work', pkgType)
  await rm(dir, {recursive: true, force: true})
  await cp(join(root, 'fixtures/src'), join(dir, 'src'), {recursive: true})
  const pkg = {name: `fixture-${pkgType}`, private: true, sideEffects: ['./src/side-effect.js']}
  if (pkgType === 'module') {
    // CJS 파일은 .cjs로 옮겨, 남는 변수를 "ESM으로 판정된 entry.js 안의 require()" 하나로 좁힌다
    pkg.type = 'module'
    for (const name of ['cjs-default', 'cjs-dep']) {
      await cp(join(dir, 'src', name + '.js'), join(dir, 'src', name + '.cjs'))
      await rm(join(dir, 'src', name + '.js'))
    }
    const entry = join(dir, 'src/entry.js')
    await writeFile(entry, (await readFile(entry, 'utf8')).replaceAll(/\.\/(cjs-default|cjs-dep)\.js/g, './$1.cjs'))
  }
  if (pkgType === 'strict') {
    for (const name of ['cjs-default', 'cjs-dep', 'side-effect']) {
      const file = join(dir, 'src', name + '.js')
      await writeFile(file, "'use strict'\n" + (await readFile(file, 'utf8')))
    }
  }
  await writeFile(join(dir, 'package.json'), JSON.stringify(pkg, null, 2))
  return dir
}

async function buildWebpack(fixture, out, {minify, concatenate}) {
  await mkdir(out, {recursive: true})
  const stats = await new Promise((resolve, reject) =>
    webpack(
      {
        mode: 'production',
        context: fixture,
        entry: './src/index.js',
        output: {path: out, clean: true},
        devtool: 'source-map',
        optimization: {minimize: minify, concatenateModules: concatenate},
      },
      (error, stats) => (error ? reject(error) : resolve(stats)),
    ),
  )
  const json = stats.toJson({
    all: false,
    modules: true,
    nestedModules: true,
    reasons: true,
    ids: true,
    orphanModules: true,
    optimizationBailout: true,
    usedExports: true,
    errors: true,
    warnings: true,
    groupModulesByType: false,
    groupModulesByPath: false,
    groupModulesByAttributes: false,
    modulesSpace: Infinity,
    nestedModulesSpace: Infinity,
  })
  const pick = (m) => ({
    id: m.id,
    name: m.name,
    orphan: m.orphan,
    usedExports: m.usedExports,
    optimizationBailout: m.optimizationBailout,
    reasons: (m.reasons || []).map((r) => ({from: r.moduleName, type: r.type, loc: r.loc, active: r.active})),
    modules: m.modules?.map(pick),
  })
  await writeFile(
    join(out, 'graph.webpack-stats.json'),
    JSON.stringify({errors: json.errors, warnings: json.warnings, modules: json.modules.map(pick)}, null, 2),
  )
}

async function buildVite(fixture, out, {minify}) {
  let infos
  const probe = {
    name: 'record-module-info',
    generateBundle() {
      // ModuleInfo#ast 같은 일부 getter는 Rolldown에서 UNSUPPORTED를 던진다
      infos = [...this.getModuleIds()].map((id) => {
        const info = this.getModuleInfo(id)
        const picked = {id}
        for (const key of Object.keys(info)) {
          if (key === 'code' || key === 'ast') continue
          try {
            picked[key] = info[key]
          } catch (error) {
            picked[key] = `<${error.message}>`
          }
        }
        return picked
      })
    },
  }
  await viteBuild({
    root: fixture,
    configFile: false,
    logLevel: 'warn',
    plugins: [probe],
    build: {
      outDir: out,
      emptyOutDir: true,
      minify,
      sourcemap: true,
      rollupOptions: {input: join(fixture, 'src/index.js')},
    },
  })
  const rel = (value) => (typeof value === 'string' && value.startsWith(fixture) ? relative(fixture, value) : value)
  const clean = (value) =>
    Array.isArray(value) ? value.map(clean) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clean(v)])) : rel(value)
  await writeFile(join(out, 'graph.rolldown-module-info.json'), JSON.stringify(clean(infos), null, 2))
}

async function buildEsbuild(fixture, out, {minify}) {
  await rm(out, {recursive: true, force: true})
  const result = await esbuild.build({
    absWorkingDir: fixture,
    entryPoints: ['src/index.js'],
    bundle: true,
    splitting: true,
    format: 'esm',
    minify,
    sourcemap: true,
    metafile: true,
    outdir: out,
    logLevel: 'warning',
  })
  await writeFile(join(out, 'graph.esbuild-metafile.json'), JSON.stringify(result.metafile, null, 2))
}

async function buildNext(fixture, out, {minify, analyze, bundler = 'turbopack'}) {
  const app = join(fixture, 'next-app')
  await rm(app, {recursive: true, force: true})
  await mkdir(join(app, 'pages'), {recursive: true})
  await writeFile(join(app, 'package.json'), JSON.stringify({name: 'next-app', private: true}))
  await writeFile(
    join(app, 'pages/index.jsx'),
    "import {run} from '../../src/entry.js'\n\nexport default function Page() {\n  return <p>{String(run().slice(0, 5))}</p>\n}\n",
  )
  await writeFile(
    join(app, 'next.config.mjs'),
    'export default ' +
      JSON.stringify({productionBrowserSourceMaps: true, turbopack: {root}, experimental: {cpus: 2, turbopackMinify: minify}}) +
      '\n',
  )
  const env = {...process.env, NEXT_TELEMETRY_DISABLED: '1'}
  await rm(out, {recursive: true, force: true})
  await mkdir(out, {recursive: true})
  if (analyze) {
    execFileSync(process.execPath, [nextBin, 'experimental-analyze', app, '--output'], {cwd: root, env, stdio: 'pipe'})
    const bytes = await readFile(join(app, '.next/diagnostics/analyze/data/modules.data'))
    await writeFile(join(out, 'modules.data'), bytes)
    const {header, lists} = decodeModulesData(bytes)
    const name = (i) => `${header.modules[i].path} ${header.modules[i].ident}`
    await writeFile(
      join(out, 'graph.turbopack-modules-data.json'),
      JSON.stringify(
        {
          headerKeys: Object.keys(header),
          moduleKeys: Object.keys(header.modules[0]),
          moduleCount: header.modules.length,
          modules: header.modules,
          lists: Object.fromEntries(Object.entries(lists).map(([k, edges]) => [k, edges.map(([a, b]) => [a, b, name(a), name(b)])])),
        },
        null,
        2,
      ),
    )
  }
  const log = execFileSync(process.execPath, [nextBin, 'build', app, ...(bundler === 'webpack' ? ['--webpack'] : [])], {
    cwd: root,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
  })
  await writeFile(join(out, 'build.log'), log)
  await cp(join(app, '.next/static'), join(out, 'static'), {recursive: true})
}

const only = process.argv[2]
if (!only) await rm(join(results, 'builds'), {recursive: true, force: true})
for (const pkgType of ['auto', 'module', 'strict']) {
  const fixture = await prepareFixture(pkgType)
  const base = join(results, 'builds', pkgType)
  const jobs = [
    ['webpack-min', () => buildWebpack(fixture, join(base, 'webpack-min'), {minify: true, concatenate: true})],
    ['webpack-nomin', () => buildWebpack(fixture, join(base, 'webpack-nomin'), {minify: false, concatenate: true})],
    ['webpack-noconcat-min', () => buildWebpack(fixture, join(base, 'webpack-noconcat-min'), {minify: true, concatenate: false})],
    ['vite-min', () => buildVite(fixture, join(base, 'vite-min'), {minify: true})],
    ['vite-nomin', () => buildVite(fixture, join(base, 'vite-nomin'), {minify: false})],
    ['esbuild-min', () => buildEsbuild(fixture, join(base, 'esbuild-min'), {minify: true})],
    ['esbuild-nomin', () => buildEsbuild(fixture, join(base, 'esbuild-nomin'), {minify: false})],
    ['turbopack-min', () => buildNext(fixture, join(base, 'turbopack-min'), {minify: true, analyze: true})],
    ['turbopack-nomin', () => buildNext(fixture, join(base, 'turbopack-nomin'), {minify: false, analyze: false})],
    // Next 16.3.8이 내장한 webpack(5.98.0)으로 같은 페이지를 빌드한다
    ['next-webpack-min', () => buildNext(fixture, join(base, 'next-webpack-min'), {minify: true, analyze: false, bundler: 'webpack'})],
  ]
  for (const [name, job] of jobs) {
    if (only && !name.startsWith(only)) continue
    if (pkgType === 'strict' && !['webpack-min', 'webpack-nomin'].includes(name)) continue
    try {
      await job()
      console.log(`ok   ${pkgType}/${name}`)
    } catch (error) {
      await mkdir(join(base, name), {recursive: true})
      await writeFile(join(base, name, 'error.txt'), String(error.stack || error) + '\n' + (error.stdout || '') + (error.stderr || ''))
      console.log(`fail ${pkgType}/${name}: ${String(error.message).split('\n')[0]}`)
    }
  }
}
console.log((await readdir(join(results, 'builds', 'auto'))).join(' '))

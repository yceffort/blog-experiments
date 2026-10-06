// 같은 CommonJS 모듈의 import와 require 산출물을 비교한다.
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises'
import {createRequire} from 'node:module'
import {tmpdir} from 'node:os'
import {join} from 'node:path'

import {build} from 'vite'

const require = createRequire(import.meta.url)
const root = await mkdtemp(join(tmpdir(), 'bundler-interop-'))
const dependency = `// dep.cjs
'use strict'
globalThis.CJS_SIDE_EFFECT = Math.random()
module.exports = {value: 1}
`
const entries = {
  import: `// 입력 A
import './dep.cjs'
globalThis.finished = true
`,
  require: `// 입력 B
require('./dep.cjs')
globalThis.finished = true
`,
}

try {
  await writeFile(join(root, 'dep.cjs'), dependency)
  const outputs = {}
  for (const [kind, source] of Object.entries(entries)) {
    await writeFile(join(root, 'entry.js'), source)
    const result = await build({
      root,
      configFile: false,
      logLevel: 'silent',
      build: {
        write: false,
        minify: true,
        rollupOptions: {input: join(root, 'entry.js')},
      },
    })
    const chunks = result.output.filter((item) => item.type === 'chunk')
    if (chunks.length !== 1)
      throw new Error(`Expected one chunk, got ${chunks.length}`)
    outputs[kind] = chunks[0].code
  }

  const version = async (name) =>
    JSON.parse(await readFile(require.resolve(`${name}/package.json`), 'utf8'))
      .version
  const report = {
    versions: {
      node: process.version,
      vite: await version('vite'),
      rolldown: await version('rolldown'),
    },
    dependency,
    entries,
    outputs,
    identical: outputs.import === outputs.require,
  }
  const json = JSON.stringify(report, null, 2) + '\n'
  await writeFile(
    new URL('../results/interop-counterexample.json', import.meta.url),
    json,
  )
  console.log(json)
} finally {
  await rm(root, {recursive: true, force: true})
}

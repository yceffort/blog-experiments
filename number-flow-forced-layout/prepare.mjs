// number-flow 포크의 세 커밋을 같은 도구(esbuild)로 번들해 work/bundles/에 둔다.
// 소스는 GitHub에서 받고, 번들과 측정에 필요한 npm 패키지는 work/deps/에 설치한다.
import {execFileSync} from 'node:child_process'
import {existsSync, mkdirSync} from 'node:fs'
import {createRequire} from 'node:module'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'

const HERE = fileURLToPath(new URL('.', import.meta.url))
export const WORK = join(HERE, 'work')
const REPO = 'https://github.com/yceffort/number-flow.git'
const DEPS = join(WORK, 'deps')

export const BUILDS = {
  'v0.2.0': '3438c3eed55c65a07d99b634ca2c0fe75becf470', // 변경 전
  pr18: '90a753968c78299d9095c78c95a5117df3b8b1c9', // PR #18 (읽기/쓰기 단계 분리)
  'v0.2.1': '477893f382cff2562df1c8522c6f1aa6a63e3f87', // PR #18 + PR #19 (prepare, animationsOf)
}

const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, {cwd, stdio: ['ignore', 'inherit', 'inherit']})

export function prepare() {
  mkdirSync(join(WORK, 'bundles'), {recursive: true})
  mkdirSync(join(WORK, 'traces'), {recursive: true})

  const repo = join(WORK, 'number-flow')
  if (!existsSync(repo)) run('git', ['clone', '--quiet', REPO, repo])
  else run('git', ['fetch', '--quiet', '--tags'], repo)

  if (!existsSync(join(DEPS, 'node_modules/playwright'))) {
    mkdirSync(DEPS, {recursive: true})
    run('npm', [
      'install',
      '--prefix',
      DEPS,
      '--no-save',
      '--no-package-lock',
      'esbuild@0.28.2',
      'esm-env@1.2.2',
      'playwright@1.62.1',
    ])
  }
  run('node', [join(DEPS, 'node_modules/playwright/cli.js'), 'install', 'chromium'])

  const require = createRequire(join(DEPS, 'node_modules/'))
  const esbuild = require('esbuild')
  const bundles = {}
  for (const [name, sha] of Object.entries(BUILDS)) {
    const src = join(WORK, `src-${name}`)
    if (!existsSync(join(src, 'index.ts'))) {
      mkdirSync(src, {recursive: true})
      const tar = execFileSync('git', ['archive', sha, 'packages/number-flow/src'], {
        cwd: repo,
        maxBuffer: 64 * 1024 * 1024,
      })
      execFileSync('tar', ['-x', '--strip-components=3', '-C', src], {input: tar})
    }
    const outfile = join(WORK, 'bundles', `${name}.js`)
    // index.ts가 <number-flow>를 스스로 define()한다. tsup 설정과 같은 es2019 타깃.
    esbuild.buildSync({
      entryPoints: [join(src, 'index.ts')],
      bundle: true,
      format: 'iife',
      globalName: 'NumberFlowBundle',
      minify: true,
      target: 'es2019',
      conditions: ['browser', 'production'],
      nodePaths: [join(DEPS, 'node_modules')],
      outfile,
      logLevel: 'warning',
    })
    bundles[name] = outfile
  }
  return {bundles, playwright: require('playwright')}
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const {bundles} = prepare()
  console.log(bundles)
}

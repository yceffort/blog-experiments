import {createHash} from 'node:crypto'
// 세 빌드를 번갈아 Chromium(헤드리스, 모바일 뷰포트, CPU 4배 감속)에서 10초씩 트레이스한다.
// 갱신 태스크(performance.mark('nf-update')가 들어 있는 RunTask)마다 JavaScript 호출 안의
// UpdateLayoutTree와 Layout(강제 동기 레이아웃)의 수와 시간을 센다.
//   node measure.mjs same   # 9자리를 9자리로 (기본)
//   node measure.mjs vary   # 9자리와 7자리를 번갈아
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {createServer} from 'node:http'
import {cpus, platform, arch} from 'node:os'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'

import {createInputs, UPDATE_COUNT} from './inputs.mjs'
import {BUILDS, WORK, prepare} from './prepare.mjs'

const HERE = fileURLToPath(new URL('.', import.meta.url))
const RESULTS = join(HERE, 'results')
const SCENARIO = process.argv[2] ?? 'same'
const RUNS = Number(process.argv[3] ?? 3)
if (!Number.isInteger(RUNS) || RUNS < 1)
  throw new Error('RUNS must be a positive integer')
const SECONDS = 10
const THROTTLE = 4
const names = Object.keys(BUILDS)
const ORDER = Array.from({length: RUNS}, (_, i) =>
  names.map((_, j) => names[(i + j) % names.length]),
).flat()
const inputs = createInputs(SCENARIO)
const inputsJSON = JSON.stringify(inputs)
const inputsSHA256 = createHash('sha256').update(inputsJSON).digest('hex')
const measuredAt = new Date().toISOString()
const machine = {cpu: cpus()[0]?.model, platform: platform(), arch: arch()}

const {bundles, playwright} = prepare()
const html = readFileSync(join(HERE, 'bench.html'))
let current = Object.keys(BUILDS)[0]
const server = createServer((req, res) => {
  if (req.url.startsWith('/bundle.js')) {
    res.setHeader('content-type', 'text/javascript')
    res.end(readFileSync(bundles[current]))
  } else if (req.url === '/inputs.json') {
    res.setHeader('content-type', 'application/json')
    res.end(inputsJSON)
  } else {
    res.setHeader('content-type', 'text/html; charset=utf-8')
    res.end(html)
  }
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const port = server.address().port

const sum = (xs) => xs.reduce((a, b) => a + b, 0)
const mean = (xs) => (xs.length ? sum(xs) / xs.length : NaN)
const fmt = (x, d = 1) => (Number.isFinite(x) ? x.toFixed(d) : '-')

function analyze(events) {
  const marks = events.filter(
    (e) =>
      (e.cat || '').includes('blink.user_timing') && e.name === 'nf-update',
  )
  if (!marks.length) throw new Error('nf-update 마크가 트레이스에 없다')
  const {pid, tid} = marks[0]
  const own = events.filter((e) => e.pid === pid && e.tid === tid)
  const complete = (name) =>
    own
      .filter((e) => e.name === name && e.ph === 'X')
      .map((e) => ({
        ts: e.ts,
        dur: e.dur ?? 0,
        end: e.ts + (e.dur ?? 0),
        args: e.args,
      }))
  const paired = (name) => {
    const out = []
    const stack = []
    for (const e of own) {
      if (e.name !== name) continue
      if (e.ph === 'B') stack.push(e)
      else if (e.ph === 'E') {
        const b = stack.pop()
        if (b)
          out.push({
            ts: b.ts,
            dur: e.ts - b.ts,
            end: e.ts,
            args: {...b.args, ...e.args},
          })
      }
    }
    return out
  }
  const tasks = complete('RunTask')
  const calls = complete('FunctionCall')
  const recalcs = complete('UpdateLayoutTree')
  let layouts = complete('Layout')
  if (!layouts.length) layouts = paired('Layout')
  const within = (e, c) => e.ts >= c.ts && e.end <= c.end + 1
  const inJS = (e) => calls.some((c) => within(e, c))
  const markTs = marks.map((m) => m.ts)
  const updateTasks = tasks.filter((t) =>
    markTs.some((ts) => ts >= t.ts && ts <= t.end),
  )
  const per = updateTasks.map((t) => {
    const r = recalcs.filter((e) => within(e, t))
    const l = layouts.filter((e) => within(e, t))
    const fr = r.filter(inJS)
    const fl = l.filter(inJS)
    return {
      ms: t.dur / 1000,
      forcedRecalcs: fr.length,
      forcedLayouts: fl.length,
      forcedMs: (sum(fr.map((e) => e.dur)) + sum(fl.map((e) => e.dur))) / 1000,
      elementCounts: fr.map(
        (e) => e.args?.elementCount ?? e.args?.endData?.elementCount ?? null,
      ),
    }
  })
  const first = tasks[0]?.ts ?? 0
  const last = tasks.at(-1)?.end ?? first
  const span = (last - first) / 1e6 // 초
  const steady = per.slice(1) // 첫 갱신은 flush()가 채널을 처음 보는 갱신이라 따로 본다
  return {
    span,
    updates: per.length,
    taskMs: mean(per.map((p) => p.ms)),
    taskMsSteady: mean(steady.map((p) => p.ms)),
    forcedRecalcs: mean(per.map((p) => p.forcedRecalcs)),
    forcedLayouts: mean(per.map((p) => p.forcedLayouts)),
    forcedRecalcsSteady: mean(steady.map((p) => p.forcedRecalcs)),
    forcedLayoutsSteady: mean(steady.map((p) => p.forcedLayouts)),
    forcedMs: mean(per.map((p) => p.forcedMs)),
    longTasks: tasks.filter((t) => t.dur > 50_000).length,
    styleLayoutMsPerS:
      (sum(recalcs.map((e) => e.dur)) + sum(layouts.map((e) => e.dur))) /
      1000 /
      span,
    jsMsPerS: sum(calls.map((e) => e.dur)) / 1000 / span,
    elementCounts: per.slice(0, 3).map((p) => p.elementCounts),
    per,
  }
}

async function measure(build, idx) {
  current = build
  const browser = await playwright.chromium.launch()
  const context = await browser.newContext({
    viewport: {width: 390, height: 844},
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await cdp.send('Emulation.setCPUThrottlingRate', {rate: THROTTLE})
  await page.goto(`http://127.0.0.1:${port}/?scenario=${SCENARIO}`)
  await page.waitForFunction(() => Boolean(window.__bench))
  await page.waitForTimeout(1000)

  const events = []
  cdp.on('Tracing.dataCollected', (e) => events.push(...e.value))
  const complete = new Promise((resolve) =>
    cdp.once('Tracing.tracingComplete', resolve),
  )
  await cdp.send('Tracing.start', {
    traceConfig: {
      includedCategories: [
        'devtools.timeline',
        'disabled-by-default-devtools.timeline',
        'blink.user_timing',
        'v8.execute',
      ],
    },
    transferMode: 'ReportEvents',
  })
  await page.evaluate(() => window.__bench.start())
  await page.evaluate(() =>
    Promise.race([
      window.__bench.done,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Benchmark timed out')), 15000),
      ),
    ]),
  )
  const counts = await page.evaluate(() => window.__bench.stop())
  await cdp.send('Tracing.end')
  await complete
  await page.waitForTimeout(1500)
  const display = await page.evaluate(() => window.__bench.check())
  const version = browser.version()
  await browser.close()

  if (
    counts.updates !== UPDATE_COUNT ||
    JSON.stringify(counts.applied) !== JSON.stringify(inputs.values)
  ) {
    throw new Error(`${build}: input sequence mismatch`)
  }

  writeFileSync(
    join(WORK, 'traces', `${SCENARIO}-${build}-${idx}.json`),
    JSON.stringify(events),
  )
  const analysis = analyze(events)
  if (analysis.updates !== UPDATE_COUNT)
    throw new Error(`${build}: missing update tasks in trace`)
  return {build, idx, version, inputsSHA256, counts, display, ...analysis}
}

const runs = []
for (const [i, build] of ORDER.entries()) {
  const r = await measure(build, Math.floor(i / Object.keys(BUILDS).length))
  runs.push(r)
  console.error(
    `${build} #${r.idx}: 갱신 ${r.updates}회, 태스크 ${fmt(r.taskMs)}ms, 강제 재계산/레이아웃 ${fmt(r.forcedRecalcs)}/${fmt(r.forcedLayouts)}, 50ms 초과 ${r.longTasks}, 배경 ${(r.counts.noise / r.span).toFixed(0)}회/s, 최종 DOM 문자열 ${r.display.ok ? '일치' : '불일치 ' + r.display.shown + ' vs ' + r.display.expected}`,
  )
}
server.close()

mkdirSync(RESULTS, {recursive: true})
writeFileSync(
  join(RESULTS, `${SCENARIO}.json`),
  JSON.stringify(
    {
      scenario: SCENARIO,
      measuredAt,
      machine,
      seconds: SECONDS,
      throttle: THROTTLE,
      inputsSHA256,
      order: ORDER,
      builds: BUILDS,
      runs,
    },
    null,
    2,
  ),
)
writeFileSync(join(RESULTS, `inputs-${SCENARIO}.json`), inputsJSON + '\n')

const byBuild = (key) => (build) =>
  mean(runs.filter((r) => r.build === build).map((r) => r[key]))
const row = (label, key, d = 1) =>
  `| ${label} | ${names.map((n) => fmt(byBuild(key)(n), d)).join(' | ')} |`
const lines = [
  `# ${SCENARIO === 'vary' ? '9자리와 7자리를 번갈아' : '9자리에서 9자리로'} 갱신, ${RUNS}회 평균`,
  '',
  `Chromium ${runs[0].version}, 헤드리스, 390x844 (dsf 3), CPU ${THROTTLE}배 감속, ${SECONDS}초 트레이스, 빌드 교대 (${ORDER.join(', ')}).`,
  `배경 텍스트 갱신 약 ${fmt(mean(runs.map((r) => r.counts.noise / r.span)), 0)}회/s, 갱신 ${fmt(mean(runs.map((r) => r.updates)), 1)}회/트레이스.`,
  `측정 시작: ${measuredAt}. ${machine.cpu}, ${machine.platform}/${machine.arch}.`,
  `고정 입력 seed: ${inputs.seed}, locale: ${inputs.locale}, SHA-256: ${inputsSHA256}.`,
  '',
  `| | ${names.join(' | ')} |`,
  `| --- | ${names.map(() => '---:').join(' | ')} |`,
  row('갱신 태스크 평균 (ms)', 'taskMs'),
  row('갱신 태스크 평균, 첫 갱신 제외 (ms)', 'taskMsSteady'),
  row('갱신당 JS 안의 UpdateLayoutTree', 'forcedRecalcs', 2),
  row('갱신당 JS 안의 Layout', 'forcedLayouts', 2),
  row('첫 갱신 제외: UpdateLayoutTree', 'forcedRecalcsSteady', 2),
  row('첫 갱신 제외: Layout', 'forcedLayoutsSteady', 2),
  row('갱신당 강제 재계산+레이아웃 시간 (ms)', 'forcedMs'),
  row('트레이스당 50ms 초과 태스크', 'longTasks'),
  row('스타일 재계산+레이아웃 전체 (ms/s)', 'styleLayoutMsPerS'),
  row('FunctionCall 전체, 하위 스타일/레이아웃 포함 (ms/s)', 'jsMsPerS'),
  '',
  `실행 종료 후 DOM 문자열 일치: ${runs.filter((r) => r.display.ok).length}/${runs.length}. 실행마다 1회 검사하며, 중간 프레임의 시각적 동등성은 검사하지 않는다.`,
  '',
  '## 실행별 결과',
  '',
  '| 실행 순서 | 빌드 | 갱신 수 | 태스크 평균 (ms) | 전체 스타일+레이아웃 (ms/s) |',
  '| ---: | --- | ---: | ---: | ---: |',
  ...runs.map(
    (r, i) =>
      `| ${i + 1} | ${r.build} | ${r.updates} | ${fmt(r.taskMs)} | ${fmt(r.styleLayoutMsPerS)} |`,
  ),
  '',
  '## 강제 UpdateLayoutTree의 요소 수 (첫 실행, 갱신 3회)',
  '',
  ...names.map(
    (n) =>
      `- ${n}: ${runs
        .find((r) => r.build === n)
        .elementCounts.map((xs) => xs.join(' / '))
        .join(' | ')}`,
  ),
]
writeFileSync(join(RESULTS, `${SCENARIO}.md`), lines.join('\n') + '\n')
console.log(lines.join('\n'))

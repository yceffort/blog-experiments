// number-flow 포크의 두 빌드를 구형 WebKit에서 돌리며, 폭이 바뀌는 동안
// .number의 transform, 마스크 모서리 폭, 등장 페이드를 getComputedStyle()로 프레임마다 읽는다.
// 화면상 페이드 폭 = 마스크 모서리 폭(요소 좌표) x 바깥 요소 scaleX. 보정이 맞으면 0.5em(16px)에 머문다.
import {execFileSync} from 'node:child_process'
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {createServer} from 'node:http'
import {createRequire} from 'node:module'
import {extname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const HERE = fileURLToPath(new URL('.', import.meta.url))
const WORK = join(HERE, 'work')
const REPO = 'https://github.com/yceffort/number-flow.git'
const BUILDS = {
  '92e7d01': '92e7d01eb83fb2d988260032213fe402ec694258', // PR #11의 기준 커밋(변경 전)
  'v0.2.0': '3438c3eed55c65a07d99b634ca2c0fe75becf470',
}
// Playwright는 릴리스마다 WebKit 빌드를 고정한다: 1.40.0 = 17.4, 1.49.0 = 18.2, 1.62.1 = 26.x
const PLAYWRIGHT = ['1.40.0', '1.49.0', '1.62.1']
const RUNS = [
  [9, 123456],
  [123456, 9],
]

const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, {cwd, stdio: ['ignore', 'ignore', 'inherit']})

function prepareBuild(name, sha) {
  const dir = join(WORK, `number-flow-${name}`)
  const dist = join(dir, 'demo/dist')
  if (existsSync(join(dist, 'selftest.html'))) return dist
  if (!existsSync(dir)) run('git', ['clone', '--quiet', REPO, dir])
  run('git', ['checkout', '--quiet', sha], dir)
  run('pnpm', ['install', '--frozen-lockfile'], dir)
  for (const pkg of ['@yceffort/number-flow', '@yceffort/number-flow-react', 'demo'])
    run('pnpm', ['--filter', pkg, 'build'], dir)
  return dist
}

function preparePlaywright(version) {
  const dir = join(WORK, `pw-${version}`)
  const pkg = join(dir, 'node_modules/playwright')
  if (!existsSync(pkg)) {
    mkdirSync(dir, {recursive: true})
    run('npm', ['install', '--prefix', dir, '--no-save', `playwright@${version}`])
  }
  run('node', [join(pkg, 'cli.js'), 'install', 'webkit'])
  return createRequire(join(dir, 'node_modules/'))('playwright')
}

const MIME = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css'}
function serve(dist, port) {
  const server = createServer((req, res) => {
    const path = new URL(req.url, 'http://x').pathname
    if (path === '/hold') return // selftest가 load를 붙잡을 때만 쓰는 요청
    const file = join(dist, path)
    if (!file.startsWith(dist) || !existsSync(file)) return res.writeHead(404).end()
    res.writeHead(200, {'content-type': MIME[extname(file)] ?? 'application/octet-stream'})
    res.end(readFileSync(file))
  })
  return new Promise((resolve) => server.listen(port, () => resolve(server)))
}

// 페이지 안에서 실행된다:
async function sample([from, to]) {
  const parse = (t) => {
    const m = t.match(/matrix\(([^)]+)\)/)
    if (!m) return {sx: 1, tx: 0}
    const v = m[1].split(',').map(Number)
    return {sx: v[0], tx: v[4]}
  }
  const flow = document.createElement('number-flow')
  flow.style.fontSize = '2rem'
  flow.locales = 'en-US'
  document.body.appendChild(flow)
  flow.update(from)
  await new Promise((r) => setTimeout(r, 1500))
  const root = flow.shadowRoot
  const number = root.querySelector('.number')
  const inner = root.querySelector('.number__inner')
  const samples = []
  const t0 = performance.now()
  flow.update(to)
  await new Promise((resolve) => {
    const tick = () => {
      const cs = getComputedStyle(number)
      const outer = parse(cs.transform)
      const fading = Array.from(
        root.querySelectorAll('.animate-presence:not([inert])'),
      ).filter((el) => {
        const o = parseFloat(getComputedStyle(el).opacity)
        return o > 0 && o < 1
      }).length
      samples.push({
        t: Math.round(performance.now() - t0),
        sx: outer.sx,
        tx: outer.tx,
        innerSx: parse(getComputedStyle(inner).transform).sx,
        corner: parseFloat(cs.getPropertyValue('-webkit-mask-size').split(',')[2]),
        dW: parseFloat(cs.getPropertyValue('--_number-flow-d-width')) || 0,
        fading,
      })
      if (performance.now() - t0 < 1100) requestAnimationFrame(tick)
      else resolve()
    }
    requestAnimationFrame(tick)
  })
  flow.remove()
  return samples
}

// 스크린샷 가운데 줄에서 페이드 폭과 검은 상자의 폭(불투명도 50% 넘는 픽셀 수)을 읽는다:
const readRow = (page, b64) =>
  page.evaluate(async (b64) => {
    const img = new Image()
    img.src = `data:image/png;base64,${b64}`
    await img.decode()
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const row = ctx.getImageData(0, Math.floor(img.height / 2), img.width, 1).data
    const dark = (x) => 1 - (row[x * 4] + row[x * 4 + 1] + row[x * 4 + 2]) / 765
    let a = -1
    let b = -1
    let box = 0
    for (let x = 0; x < img.width; x++) {
      if (a < 0 && dark(x) > 0.05) a = x
      if (b < 0 && dark(x) > 0.95) b = x
      if (dark(x) > 0.5) box++
    }
    return {fade: a < 0 || b < 0 ? null : (b - a) / 0.9, box}
  }, b64)

// getComputedStyle()이 실제 렌더링과 다를 수 있으므로, 같은 장면을 스크린샷으로도 잰다.
// ::part(number)에 검은 배경을 깔면 마스크가 그 배경의 가장자리를 흐리게 만든다.
// 가운데 줄에서 불투명도가 5%에서 95%로 오르는 구간을 0.9로 나누면 화면상 페이드 폭이다.
async function pixels(page) {
  await page.evaluate(async () => {
    const style = document.createElement('style')
    style.textContent = 'body{background:#fff} number-flow::part(number){background:#000}'
    document.head.appendChild(style)
    const flow = document.createElement('number-flow')
    flow.id = 'px'
    flow.style.cssText = 'font-size:2rem;position:fixed;left:100px;top:300px'
    flow.locales = 'en-US'
    document.body.appendChild(flow)
    flow.update(9)
    await new Promise((r) => setTimeout(r, 1500))
  })
  const rect = await page.evaluate(() => {
    const r = document.getElementById('px').getBoundingClientRect()
    return {x: r.x, y: r.y, width: r.width, height: r.height}
  })
  const clip = {x: 0, y: Math.round(rect.y), width: 900, height: Math.round(rect.height)}
  const shots = []
  const t0 = Date.now()
  await page.evaluate(() => document.getElementById('px').update(123456))
  while (Date.now() - t0 < 900) {
    const t = Date.now() - t0
    const computed = await page.evaluate(() => {
      const number = document.getElementById('px').shadowRoot.querySelector('.number')
      const cs = getComputedStyle(number)
      const m = cs.transform.match(/matrix\(([^,]+)/)
      const corner = parseFloat(cs.getPropertyValue('-webkit-mask-size').split(',')[2])
      return corner * (m ? parseFloat(m[1]) : 1)
    })
    shots.push({t, computed, png: (await page.screenshot({clip})).toString('base64')})
  }
  for (const shot of shots) {
    Object.assign(shot, await readRow(page, shot.png))
    delete shot.png
  }
  await new Promise((r) => setTimeout(r, 500))
  await page.evaluate(() => document.getElementById('px').style.setProperty('--number-flow-mask-width', '1.5em'))
  const control = await readRow(page, (await page.screenshot({clip})).toString('base64'))
  await page.evaluate(() => document.getElementById('px').remove())
  return {control, shots}
}

// 스크린샷도 강제로 새 프레임을 그릴 수 있으므로, 실제 재생 프레임을 녹화해서도 본다.
// 구형 WebKit은 헤드리스에서 빈 화면만 녹화되므로 창을 띄워(headed) 녹화한다.
// 장면 A: 검은 배경 상자가 9 → 123456으로 커지는 동안 가운데 줄의 상자 폭과 페이드 폭.
//   압축으로 가장자리가 번지므로 페이드 폭은 불투명도 20%에서 80% 구간을 0.6으로 나눠 구한다.
// 장면 B, C: 새로 들어오는 문자(5 → -5의 부호, 9 → 19의 1)가 최종적으로 놓일 자리에서
//   가장 진한 픽셀 값. 오른쪽 끝을 고정해 새 문자가 빈 자리로 들어오게 한다.
//   페이드가 그려지면 0에서 1로 서서히 오르고, 안 그려지면 바로 1에 가깝다.
// 장면 D: 장면 B와 같되 opacityTiming만 2초(linear)로 늘린 대조군. 오르는 구간이 함께 늘어나면
//   그 증가는 글자의 이동이나 마스크가 아니라 투명도 페이드에서 나온 것이다.
async function video(pw, port, label) {
  const dir = join(WORK, 'video', label)
  const browser = await pw.webkit.launch({headless: false})
  const context = await browser.newContext({
    viewport: {width: 1280, height: 720},
    recordVideo: {dir, size: {width: 1280, height: 720}},
  })
  const page = await context.newPage()
  await page.goto(`http://localhost:${port}/selftest.html`)
  await page.waitForFunction(() => window.__nfResults, null, {timeout: 60_000})
  const regions = await page.evaluate(async () => {
    document.getElementById('stage')?.remove()
    document.getElementById('out')?.remove()
    const style = document.createElement('style')
    style.textContent = 'body{background:#fff;color:#000} #a::part(number){background:#000}'
    document.head.appendChild(style)
    const wait = (ms) => new Promise((r) => setTimeout(r, ms))
    const even = (v) => Math.round(v / 2) * 2 // yuv420 영상은 짝수 좌표로 잘라야 한다
    const make = (id, css, value) => {
      const flow = document.createElement('number-flow')
      flow.id = id
      flow.style.cssText = `position:fixed;${css}`
      flow.locales = 'en-US'
      document.body.appendChild(flow)
      flow.update(value)
      return flow
    }
    const a = make('a', 'left:100px;top:150px;font-size:2rem', 9)
    const b = make('b', 'right:700px;top:300px;font-size:6rem', 5)
    const c = make('c', 'right:700px;top:480px;font-size:6rem', 9)
    const d = make('d', 'right:200px;top:300px;font-size:6rem', 5)
    d.opacityTiming = {duration: 2000, easing: 'linear'}
    await wait(1500)
    const r = a.getBoundingClientRect()
    a.update(123456)
    await wait(1500)
    // 장면 A의 대조군: 마스크 폭을 1.5em(48px)으로 바꾼 정지 화면
    a.style.setProperty('--number-flow-mask-width', '1.5em')
    await wait(800)
    b.update(-5)
    await wait(1500)
    c.update(19)
    await wait(1500)
    d.update(-5)
    await wait(2500)
    // 새 문자가 최종적으로 놓인 자리의 가운데 띠:
    const box = (el) => {
      const q = el.getBoundingClientRect()
      return {x: even(q.x), y: even(q.y + q.height * 0.3), w: even(q.width), h: even(q.height * 0.4)}
    }
    const entering = (flow) =>
      flow.shadowRoot.querySelector('.animate-presence:not([inert])')
    return {
      rowA: even(r.y + r.height / 2),
      b: box(entering(b)),
      c: box(entering(c)),
      d: box(entering(d)),
    }
  })
  const path = await page.video().path()
  await context.close()
  await browser.close()
  const duration = parseFloat(
    execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path]).toString(),
  )
  const crop = (w, h, x, y) =>
    execFileSync('ffmpeg', ['-v', 'error', '-i', path, '-vf', `crop=${w}:${h}:${x}:${y},format=gray`, '-f', 'rawvideo', '-'], {maxBuffer: 1 << 28})
  const rowA = crop(900, 2, 0, regions.rowA)
  const a = []
  for (let i = 0; i + 1800 <= rowA.length; i += 1800) {
    const dark = (x) => 1 - rowA[i + x] / 255
    let lo = -1
    let hi = -1
    let box = 0
    for (let x = 0; x < 900; x++) {
      if (lo < 0 && dark(x) > 0.2) lo = x
      if (hi < 0 && dark(x) > 0.8) hi = x
      if (dark(x) > 0.5) box++
    }
    a.push({box, fade: lo < 0 || hi < 0 ? null : (hi - lo) / 0.6})
  }
  const peak = ({x, y, w, h}) => {
    const raw = crop(w, h, x, y)
    const out = []
    for (let i = 0; i + w * h <= raw.length; i += w * h) {
      let min = 255
      for (let k = 0; k < w * h; k++) min = Math.min(min, raw[i + k])
      out.push(+(1 - min / 255).toFixed(2))
    }
    return out
  }
  return {msPerFrame: (duration * 1000) / a.length, a, b: peak(regions.b), c: peak(regions.c), d: peak(regions.d)}
}

const range = (xs) => [Math.min(...xs), Math.max(...xs)]
const fmt = ([a, b], d = 2) => `${a.toFixed(d)}~${b.toFixed(d)}`

mkdirSync(join(HERE, 'results'), {recursive: true})
const results = []
const shots = []
const videos = []
let port = 5320
for (const [name, sha] of Object.entries(BUILDS)) {
  const server = await serve(prepareBuild(name, sha), port)
  for (const version of PLAYWRIGHT) {
    const pw = preparePlaywright(version)
    const browser = await pw.webkit.launch()
    const page = await browser.newPage()
    await page.goto(`http://localhost:${port}/selftest.html`)
    await page.waitForFunction(() => window.__nfResults, null, {timeout: 60_000})
    const native = await page.evaluate(() => window.__nfResults.env.supportsNativeAnimations)
    for (const [from, to] of RUNS) {
      const samples = await page.evaluate(sample, [from, to])
      results.push({build: name, webkit: browser.version(), native, from, to, samples})
    }
    shots.push({build: name, webkit: browser.version(), ...(await pixels(page))})
    videos.push({build: name, webkit: browser.version(), ...(await video(pw, port, `${name}-${version}`))})
    await browser.close()
  }
  server.close()
  port++
}
writeFileSync(join(HERE, 'results/samples.json'), JSON.stringify(results, null, 1) + '\n')
writeFileSync(join(HERE, 'results/pixels.json'), JSON.stringify(shots, null, 1) + '\n')
writeFileSync(join(HERE, 'results/video.json'), JSON.stringify(videos, null, 1) + '\n')

console.log('| 빌드 | WebKit | 변경 | 바깥 scaleX | 마스크 모서리 폭(px) | 계산상 화면 페이드 폭(px) | 페이드 중인 문자가 보인 프레임 |')
console.log('| --- | --- | --- | --- | --- | --- | --- |')
for (const r of results) {
  const s = r.samples
  console.log(
    `| ${r.build} | ${r.webkit} | ${r.from} → ${r.to} | ${fmt(range(s.map((x) => x.sx)), 3)} | ${fmt(range(s.map((x) => x.corner)))} | ${fmt(range(s.map((x) => x.corner * x.sx)))} | ${s.filter((x) => x.fading > 0).length}/${s.length} |`,
  )
}

console.log('\n| 빌드 | WebKit | 대조군(마스크 1.5em) 픽셀 페이드 폭 | 스크린샷 수 | 상자 폭(px) | 계산상 페이드 폭(px) | 픽셀 페이드 폭(px) |')
console.log('| --- | --- | --- | --- | --- | --- | --- |')
for (const r of shots)
  console.log(
    `| ${r.build} | ${r.webkit} | ${r.control.fade.toFixed(1)} | ${r.shots.length} | ${fmt(range(r.shots.map((s) => s.box)), 0)} | ${fmt(range(r.shots.map((s) => s.computed)), 1)} | ${fmt(range(r.shots.map((s) => s.fade)), 1)} |`,
  )

// 진하기가 0.03을 넘기 시작해 0.95에 닿기까지 걸린 시간(ms):
const rampMs = (xs, msPerFrame) => {
  const end = xs.findIndex((x) => x >= 0.95)
  let start = end
  while (start > 0 && xs[start - 1] > 0.03) start--
  return Math.round((end - start) * msPerFrame)
}
console.log('\n| 빌드 | WebKit | 장면 A 상자 폭(px) | 장면 A 페이드 폭(px) | 대조군(1.5em) | 장면 B 페이드(ms) | 장면 C 페이드(ms) | 장면 D 페이드 2초(ms) |')
console.log('| --- | --- | --- | --- | --- | --- | --- | --- |')
for (const r of videos) {
  // 9의 상자(52px)가 줄어드는 순간부터 135px에 닿을 때까지가 성장 애니메이션 구간이다:
  const plateau = r.a.findIndex((f) => f.box >= 50)
  const start = r.a.findIndex((f, i) => i > plateau && f.box > 0 && f.box < 50)
  const end = r.a.findIndex((f, i) => i > start && f.box >= 135)
  const moving = r.a.slice(start, end + 1)
  console.log(
    `| ${r.build} | ${r.webkit} | ${fmt(range(moving.map((f) => f.box)), 0)} | ${fmt(range(moving.map((f) => f.fade)), 0)} | ${r.a.at(-1).fade.toFixed(0)} | ${rampMs(r.b, r.msPerFrame)} | ${rampMs(r.c, r.msPerFrame)} | ${rampMs(r.d, r.msPerFrame)} |`,
  )
}

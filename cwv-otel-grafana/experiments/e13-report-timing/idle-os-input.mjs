// 클릭을 OS 마우스 이벤트로 넣었을 때도 idle 이 다음 입력까지 오지 않는지 잰다(idle-after-input.mjs 의 클릭은 CDP 입력이다).
// DevTools 를 붙이지 않은 Chrome Beta 를 띄우고, 클릭의 Event Timing 항목을 받은 관찰자 콜백에서 requestIdleCallback(timeout 10초)을 건다.
// 불릴 때까지 페이지에 들어온 입력도 함께 남긴다.
// 사용: node idle-os-input.mjs   (REPEAT, WAKE=ms 면 클릭 그만큼 뒤 마우스를 한 번 움직인다. macOS 전용. 먼저 swiftc -O os-click.swift -o os-click)
import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { createServer } from 'node:http';

const BIN = process.env.BIN ?? '/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta';
const CLICK = new URL('./os-click', import.meta.url).pathname;
const REPEAT = Number(process.env.REPEAT ?? 5);
const TIMEOUT = 10000;
const GAP = 12000;
const WAKE = Number(process.env.WAKE ?? 0); // 0 이 아니면 클릭 WAKE ms 뒤 OS 마우스 이동을 한 번 넣는다
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const html = `<!doctype html><meta charset="utf-8"><title>idle</title>
<style>html,body{margin:0;height:100%;font:20px system-ui}button{width:100%;height:70%;font-size:32px}pre{margin:8px}</style>
<button id="b">click</button><pre id="r"></pre><script>
  const out = [];
  const log = (o) => out.push({ t: Math.round(performance.now()), ...o });
  const flush = () => fetch('/log', { method: 'POST', body: JSON.stringify(out.splice(0)) });
  for (const type of ['pointermove', 'pointerdown', 'pointerup', 'keydown', 'wheel', 'focus', 'blur', 'visibilitychange']) {
    addEventListener(type, (e) => log({ k: type, trusted: e.isTrusted }), true);
  }
  b.addEventListener('click', (e) => log({ k: 'click', trusted: e.isTrusted, focus: document.hasFocus() }));
  let last = 0;
  new PerformanceObserver((list) => {
    const es = list.getEntries().filter((e) => e.interactionId && e.interactionId !== last);
    if (!es.length) return;
    last = es[0].interactionId;
    const t = performance.now();
    log({ k: 'entry', dur: Math.max(...es.map((e) => e.duration)) });
    requestIdleCallback((d) => {
      log({ k: 'idle', after: Math.round(performance.now() - t), timeout: d.didTimeout });
      r.textContent += 'idle ' + Math.round(performance.now() - t) + 'ms' + (d.didTimeout ? ' (timeout)' : '') + '\\n';
      flush();
    }, { timeout: ${TIMEOUT} });
  }).observe({ type: 'event', durationThreshold: 16 });
  addEventListener('load', () => { log({ k: 'load', screenX, screenY, outerWidth, outerHeight, innerWidth, innerHeight }); flush(); });
</script>`;

const logs = [];
const server = createServer((req, res) => {
  if (req.method !== 'POST') return res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(html);
  let body = '';
  req.on('data', (c) => { body += c; });
  req.on('end', () => { logs.push(...JSON.parse(body)); res.writeHead(204).end(); });
}).listen(34387, '127.0.0.1');

const until = async (f, ms = 20000) => {
  for (const end = Date.now() + ms; !f(); await wait(100)) if (Date.now() > end) throw new Error('timeout');
};
const osClick = (x, y) => execFileSync(CLICK, ['click', String(Math.round(x)), String(Math.round(y)), String(proc.pid)]);

const version = execFileSync(BIN, ['--version']).toString().trim();
const cursor = execFileSync(CLICK, ['where']).toString().trim().split(' ');
const dir = mkdtempSync(`${process.env.TMPDIR}/e13-os-`);
const proc = spawn(BIN, [
  `--user-data-dir=${dir}`, '--no-first-run', '--no-default-browser-check', '--window-position=200,150', '--window-size=900,700',
  'http://127.0.0.1:34387/',
], { stdio: 'ignore' });

try {
  await until(() => logs.some((o) => o.k === 'load'));
  const g = logs.find((o) => o.k === 'load');
  // 창을 앞으로 가져오려고 탭 줄의 빈 곳을 누른다(페이지에는 입력이 가지 않는다)
  await wait(1000);
  osClick(g.screenX + g.outerWidth * 0.6, g.screenY + 20);
  await wait(2000);
  const x = g.innerWidth / 2;
  const y = g.innerHeight * 0.35;
  for (let i = 0; i < REPEAT; i++) {
    osClick(g.screenX + x, g.screenY + g.outerHeight - g.innerHeight + y);
    if (WAKE) {
      await wait(WAKE);
      execFileSync(CLICK, ['move', String(Math.round(g.screenX + x + 20)), String(Math.round(g.screenY + g.outerHeight - g.innerHeight + y)), String(proc.pid)]);
    }
    await wait(GAP - WAKE);
  }
} finally {
  execFileSync(CLICK, ['warp', ...cursor]);
  proc.kill();
  server.close();
}

console.log(`# ${version}, OS 마우스 이벤트 클릭${WAKE ? `, 클릭 ${WAKE}ms 뒤 마우스 이동` : ''}, idle 콜백 timeout ${TIMEOUT}ms`);
for (const c of logs.filter((o) => o.k === 'click')) {
  const entry = logs.find((o) => o.k === 'entry' && o.t >= c.t);
  const idle = entry && logs.find((o) => o.k === 'idle' && o.t > entry.t);
  const between = idle ? logs.filter((o) => ['pointermove', 'pointerdown', 'keydown', 'wheel'].includes(o.k) && o.t > entry.t && o.t <= idle.t) : [];
  console.log(`  click t=${c.t} trusted=${c.trusted} focus=${c.focus}: idle ${idle ? `${idle.after}ms${idle.timeout ? ' (timeout)' : ''}` : '-'}, 그 사이 입력 ${between.map((o) => `${o.k}@+${o.t - entry.t}`).join(' ') || '없음'}`);
}

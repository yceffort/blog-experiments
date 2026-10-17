// 클릭 뒤 언제 idle 이 오는지 잰다. web-vitals 는 INP 항목을 받은 관찰자 콜백에서 requestIdleCallback 을 건다.
// 버튼 하나뿐인 페이지에서 클릭 핸들러는 아무 일도 하지 않는다. idle 콜백의 timeout 은 3초로 둔다.
// 사용: node e13-report-timing/idle-after-input.mjs   (BIN=브라우저 실행 파일 이면 Playwright 기본 플래그 없이 직접 띄워 CDP 로 붙는다. HEADED=1 이면 창을 띄운다)
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';

import { chromium } from 'playwright';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const REPEAT = Number(process.env.REPEAT ?? 5);

const html = `<!doctype html><meta charset="utf-8"><title>idle</title><button id="b" style="font-size:24px">click</button><script>
  window.out = [];
  const idle = (label, from) => requestIdleCallback((d) => out.push({ label, ms: Math.round(performance.now() - from), timeout: d.didTimeout }), { timeout: 3000 });
  window.plain = () => idle('입력 없이', performance.now());
  b.addEventListener('click', () => idle('클릭 핸들러 안', performance.now()));
  new PerformanceObserver((list) => {
    if (!list.getEntries().some((e) => e.interactionId)) return;
    const t = performance.now();
    const offset = Number(new URLSearchParams(location.search).get('offset'));
    const go = () => idle(\`항목을 받고 \${offset}ms 뒤\`, t);
    offset ? setTimeout(go, offset) : go();
  }).observe({ type: 'event', durationThreshold: 16 });
</script>`;
const server = createServer((req, res) => res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(html)).listen(34384, '127.0.0.1');

let browser;
let proc;
if (process.env.BIN) {
  const dir = mkdtempSync(`${process.env.TMPDIR ?? tmpdir()}/e13-profile-`);
  proc = spawn(process.env.BIN, ['--remote-debugging-port=34399', `--user-data-dir=${dir}`, '--no-first-run', '--no-default-browser-check', ...(process.env.HEADED ? [] : ['--headless=new']), 'about:blank'], { stdio: 'ignore' });
  for (let i = 0; ; i++) {
    try { browser = await chromium.connectOverCDP('http://127.0.0.1:34399'); break; } catch { if (i > 50) throw new Error('CDP 에 붙지 못했다'); await wait(200); }
  }
} else {
  browser = await chromium.launch({ channel: 'chromium', headless: !process.env.HEADED });
}
const context = process.env.BIN ? browser.contexts()[0] : await browser.newContext();
console.log(`# ${browser.version()} ${process.env.BIN ? '직접 실행' : 'Playwright 실행'} ${process.env.HEADED ? 'headed' : 'headless'}, ${REPEAT}번씩, idle 콜백 timeout 3000ms`);

const results = [];
for (const offset of [0, 300, 900]) {
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:34384/?offset=${offset}`, { waitUntil: 'load' });
  await wait(500);
  for (let i = 0; i < REPEAT; i++) {
    if (offset === 0) { await page.evaluate(() => window.plain()); await wait(500); }
    await page.click('#b');
    await wait(3500);
  }
  results.push(...(await page.evaluate(() => window.out)));
  await page.close();
}
for (const label of [...new Set(results.map((o) => o.label))]) {
  const xs = results.filter((o) => o.label === label);
  console.log(`  ${label}: ${xs.map((o) => `${o.ms}${o.timeout ? '(timeout)' : ''}`).join(', ')} ms`);
}
await browser.close();
proc?.kill();
server.close();

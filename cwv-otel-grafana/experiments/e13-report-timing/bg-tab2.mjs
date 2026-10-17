// 백그라운드 탭에서 로드된 페이지에서 web-vitals 6.2.3 이 무엇을 보고하는지 센다.
// CDP Target.createTarget 의 background 로 뒤쪽 탭을 만든다. 창을 띄워야(headed) 탭 상태가 visibilityState 에 반영된다.
// 사용: node e13-report-timing/bg-tab2.mjs   (REPEAT 로 반복 수)
import { createServer } from 'node:http';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';

import { chromium } from 'playwright';

const PORT = 34387;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const REPEAT = Number(process.env.REPEAT ?? 5);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const logs = new Map();

const page = (run) => `<!doctype html><meta charset="utf-8"><title>bg</title>
<script src="/vendor/web-vitals-v6.2.3.iife.js"></script>
<script>
  const RUN = ${JSON.stringify(run)};
  const send = (o) => navigator.sendBeacon('/log', JSON.stringify({ run: RUN, t: Math.round(performance.now()), ...o }));
  send({ k: 'state', vis: document.visibilityState, entries: performance.getEntriesByType('visibility-state').map((e) => e.name + '@' + Math.round(e.startTime)) });
  for (const name of ['TTFB', 'FCP', 'LCP', 'CLS', 'INP']) {
    webVitals['on' + name]((m) => send({ k: 'report', name: m.name, value: Math.round(m.value * 1000) / 1000 }));
  }
  addEventListener('visibilitychange', () => send({ k: 'vis', vis: document.visibilityState }), true);
</script>
<h1>bg</h1><p style="font-size:20px">백그라운드 탭에서 열린 페이지. 글자 블록이 LCP 후보다.</p>
<button id="b" style="font-size:24px">click</button>
<script>
  b.addEventListener('click', () => { const end = performance.now() + 100; while (performance.now() < end); send({ k: 'clicked' }); });
</script>`;

const server = createServer((req, res) => {
  const url = new URL(req.url, ORIGIN);
  if (url.pathname === '/log') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      const o = JSON.parse(body);
      if (!logs.has(o.run)) logs.set(o.run, []);
      logs.get(o.run).push(o);
      res.writeHead(204).end();
    });
    return;
  }
  if (url.pathname.startsWith('/vendor/')) {
    res.writeHead(200, { 'content-type': 'text/javascript' });
    return res.end(readFileSync(new URL(`.${url.pathname}`, import.meta.url)));
  }
  if (url.pathname === '/page') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return res.end(page(url.searchParams.get('run')));
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end('<!doctype html><title>blank</title><p>blank');
});
await new Promise((r) => server.listen(PORT, '127.0.0.1', r));

const dir = mkdtempSync(`${process.env.TMPDIR ?? tmpdir()}/e13-bg-`);
const context = await chromium.launchPersistentContext(dir, { channel: 'chromium', headless: false });
const browser = context.browser();
const cdp = await browser.newBrowserCDPSession();
console.log(`# ${browser.version()} headed, repeat ${REPEAT}, web-vitals 6.2.3`);

const summary = [];
for (const mode of ['background', 'foreground']) {
  for (let i = 0; i < REPEAT; i++) {
    const run = `${mode}-${i}-${Date.now()}`;
    const a = context.pages()[0] ?? (await context.newPage());
    await a.goto(`${ORIGIN}/blank`);
    await a.bringToFront();
    const opened = context.waitForEvent('page');
    await cdp.send('Target.createTarget', { url: `${ORIGIN}/page?run=${run}`, background: mode === 'background', newWindow: false });
    const b = await opened;
    await b.waitForLoadState('load');
    await wait(2000);
    if (mode === 'background') {
      await b.bringToFront();
      await wait(500);
    }
    await b.click('#b');
    await wait(1500);
    await b.close();
    await wait(800);
    const log = logs.get(run) ?? [];
    const state = log.find((o) => o.k === 'state');
    const vis = log.filter((o) => o.k === 'vis').map((o) => o.vis);
    const reports = log.filter((o) => o.k === 'report').map((o) => `${o.name}=${o.value}`);
    summary.push({ mode, names: log.filter((o) => o.k === 'report').map((o) => o.name) });
    console.log(`${mode} #${i}: at script ${state?.vis} [${state?.entries?.join(' ')}], visibilitychange ${vis.join('>') || '-'}, reports ${reports.join(' ') || '-'}`);
  }
}
console.log('\n# 보고된 방문 / 방문');
for (const mode of ['background', 'foreground']) {
  const rs = summary.filter((s) => s.mode === mode);
  console.log(`${mode.padEnd(10)} ${['TTFB', 'FCP', 'LCP', 'CLS', 'INP'].map((n) => `${n} ${rs.filter((r) => r.names.includes(n)).length}/${rs.length}`).join('  ')}`);
}
await context.close();
server.close();

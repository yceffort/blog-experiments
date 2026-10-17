// web-vitals 6.2.3 이 방문의 모양에 따라 어떤 보고를 하는지 본다.
// 1) load 전에 떠난 방문의 TTFB  2) bfcache 로 돌아온 방문의 TTFB, FCP, LCP, INP
// 떠나는 문서의 기록은 sendBeacon 으로 이 스크립트의 서버에 보낸다.
// 사용: node e13-report-timing/reports.mjs   (REPEAT 로 반복 횟수)
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';

import { chromium } from 'playwright';

const PORT = 34383;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const REPEAT = Number(process.env.REPEAT ?? 5);
const VERSION = process.env.VERSION ?? 'v6.2.3';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const logs = new Map();
const head = (q) => `<!doctype html><meta charset="utf-8"><title>reports</title>
<script src="/vendor/web-vitals-${VERSION}.iife.js"></script>
<script>
  const RUN = ${JSON.stringify(q.get('run'))};
  const send = (o) => navigator.sendBeacon('/log', JSON.stringify({ run: RUN, t: Math.round(performance.now()), ...o }));
  for (const name of ['TTFB', 'FCP', 'LCP', 'CLS', 'INP']) {
    webVitals['on' + name]((m) => send({ k: 'report', name: m.name, value: Math.round(m.value * 1000) / 1000, id: m.id, nav: m.navigationType }));
  }
  addEventListener('pagehide', (e) => send({ k: 'pagehide', persisted: e.persisted, responseStart: Math.round(performance.getEntriesByType('navigation')[0]?.responseStart ?? -1), readyState: document.readyState }), true);
  addEventListener('pageshow', (e) => e.persisted && send({ k: 'restored' }), true);
  addEventListener('load', () => send({ k: 'load' }), true);
</script>`;

const server = createServer((req, res) => {
  const url = new URL(req.url, ORIGIN);
  const q = url.searchParams;
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
  if (url.pathname === '/slow.svg') {
    // load 이벤트를 늦추는 이미지
    return setTimeout(() => res.writeHead(200, { 'content-type': 'image/svg+xml' }).end('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>'), Number(q.get('ms')));
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' === q.get('cc') ? 'no-store' : 'max-age=0' });
  if (url.pathname === '/slow') {
    return res.end(`${head(q)}<h1>load 가 늦는 페이지</h1><p>이미지가 ${q.get('ms')}ms 뒤에 온다.</p><img src="/slow.svg?ms=${q.get('ms')}" width="10" height="10">`);
  }
  if (url.pathname === '/bf') {
    return res.end(`${head(q)}<h1>bfcache 로 돌아오는 페이지</h1><p>본문</p>
<button id="b" style="font-size:24px">click</button> <a id="next" href="/next">next</a>
<script>b.addEventListener('click', () => { const end = performance.now() + ${Number(q.get('work') ?? 0)}; while (performance.now() < end); });</script>`);
  }
  res.end('<!doctype html><title>next</title><p>next');
});
await new Promise((r) => server.listen(PORT, '127.0.0.1', r));

// bfcache 복원은 new headless 에서 Playwright 가 기본으로 넣는 --disable-back-forward-cache 를 뺐을 때만 일어난다(E12).
const browser = await chromium.launch({ channel: 'chromium', ignoreDefaultArgs: ['--disable-back-forward-cache'] });
console.log(`# ${browser.version()} new headless, web-vitals ${VERSION}, repeat ${REPEAT}`);
const show = (log) => log.filter((o) => o.k === 'report').map((o) => `${o.name}${o.nav === 'back-forward-cache' ? '(bf)' : ''}=${o.value}`).join(' ');

// 1) load 전에 떠난 방문. 이미지 때문에 load 가 3초 뒤에 온다. 1초 뒤에 떠나는 방문과 5초 뒤에 떠나는 방문.
for (const leaveAt of [1000, 5000]) {
  for (let i = 0; i < REPEAT; i++) {
    const run = `slow-${leaveAt}-${i}-${Date.now()}`;
    const context = await browser.newContext();
    const p = await context.newPage();
    await p.goto(`${ORIGIN}/slow?${new URLSearchParams({ ms: 3000, run })}`, { waitUntil: 'commit' });
    await wait(leaveAt);
    await p.evaluate(() => { location.href = '/next'; });
    await p.waitForURL(`${ORIGIN}/next`);
    await wait(1000);
    await context.close();
    const log = logs.get(run) ?? [];
    const hide = log.find((o) => o.k === 'pagehide');
    console.log(`slow page, leave at ${leaveAt}ms #${i}: readyState at pagehide ${hide?.readyState}, responseStart ${hide?.responseStart}ms, reports: ${show(log)}`);
  }
}

// 2) bfcache 로 돌아온 방문. 처음 방문에서 한 번 클릭하고 떠났다가 뒤로 가기로 돌아와 다시 클릭하고 떠난다.
for (const work of [0, 20, 60]) {
  for (let i = 0; i < REPEAT; i++) {
    const run = `bf-${work}-${i}-${Date.now()}`;
    const context = await browser.newContext();
    const p = await context.newPage();
    await p.goto(`${ORIGIN}/bf?${new URLSearchParams({ work, run })}`, { waitUntil: 'load' });
    await wait(500);
    await p.click('#b');
    await wait(1500);
    await p.click('#next');
    await p.waitForURL(`${ORIGIN}/next`);
    await wait(500);
    await p.goBack({ waitUntil: 'commit' });
    await wait(1000);
    await p.click('#b');
    await wait(1500);
    await p.click('#next');
    await p.waitForURL(`${ORIGIN}/next`);
    await wait(1000);
    await context.close();
    const log = logs.get(run) ?? [];
    console.log(`bfcache, click handler ${work}ms #${i}: restored ${log.filter((o) => o.k === 'restored').length}, reports: ${show(log)}`);
  }
}
await browser.close();
server.close();

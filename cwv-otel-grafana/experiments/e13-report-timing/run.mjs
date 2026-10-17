// 상호작용 직후 페이지를 떠날 때 web-vitals 가 INP 를 보고하는지 센다(web-vitals #805).
// 6.2.3 과 수정이 들어간 main(e773747)을 같은 페이지에 올리고, 떠나는 방법과 시점, 메인 스레드 상태를 바꿔 가며 반복한다.
// 떠나는 문서의 기록은 sendBeacon 으로 이 스크립트의 서버에 보낸다.
// 사용: node e13-report-timing/run.mjs   (HEADED=1 이면 창을 띄운다. REPEAT, VERSIONS, LOADS, CASES 로 범위를 줄인다)
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';

import { chromium } from 'playwright';

const PORT = 34380;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const REPEAT = Number(process.env.REPEAT ?? 5);
const VERSIONS = (process.env.VERSIONS ?? 'v6.2.3,e773747').split(',');
const LOADS = (process.env.LOADS ?? 'idle,busy').split(',');
// timer: 클릭 핸들러가 delay 뒤 location.href 로 이동. link: 링크 클릭, /next 응답을 delay 만큼 늦춘다. close: delay 뒤 탭을 닫는다.
const CASES = (process.env.CASES ?? 'timer:100,timer:300,timer:600,timer:1500,link:0,link:300,link:1500,close:300,close:1500')
  .split(',').map((c) => { const [leave, delay] = c.split(':'); return { leave, delay: Number(delay) }; });
const RAC = !!process.env.RAC; // INP 를 reportAllChanges 로 받고 같은 id 의 마지막 값을 쓴다
const WORK = 200; // 클릭 핸들러가 메인 스레드를 잡는 시간(ms)
const BUSY = 3000; // busy 일 때 클릭 뒤 45ms 작업을 쉬지 않고 이어 붙이는 시간(ms)
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const logs = new Map();
const page = (q) => `<!doctype html><meta charset="utf-8"><title>e13</title>
<script src="/vendor/web-vitals-${q.get('v')}.iife.js"></script>
<script>
  const RUN = ${JSON.stringify(q.get('run'))};
  const send = (o) => navigator.sendBeacon('/log', JSON.stringify({ run: RUN, t: Math.round(performance.now()), ...o }));
  for (const name of ['TTFB', 'FCP', 'LCP', 'CLS', 'INP']) {
    const opts = name === 'INP' && ${RAC} ? { reportAllChanges: true } : {};
    webVitals['on' + name]((m) => send({ k: 'report', name: m.name, value: Math.round(m.value * 1000) / 1000, id: m.id }), opts);
  }
  // web-vitals 와 같은 시점에 entry 를 받는 관찰자. 받은 시각과, 그 자리에서 건 idle 콜백이 불린 시각을 남긴다.
  const obs = new PerformanceObserver((list) => {
    const slow = list.getEntries().filter((e) => e.interactionId && e.duration >= ${WORK});
    if (!slow.length) return;
    send({ k: 'entry', dur: Math.max(...slow.map((e) => e.duration)) });
    requestIdleCallback((d) => send({ k: 'idle', timeout: d.didTimeout }), { timeout: 5000 });
  });
  obs.observe({ type: 'event', durationThreshold: 16 });
  // 숨겨질 때 관찰자 큐에 남아 있던 상호작용 항목(아직 콜백으로 전달되지 않은 것)
  addEventListener('visibilitychange', () => {
    const left = obs.takeRecords().filter((e) => e.interactionId);
    send({ k: 'taken', n: left.length, dur: left.length ? Math.max(...left.map((e) => e.duration)) : 0 });
  }, true);
  addEventListener('pagehide', () => send({ k: 'pagehide' }), true);
</script>
<h1>e13</h1><p>상호작용 직후 떠나는 방문</p>
<a id="b" href="/next?delay=${Number(q.get('delay'))}" style="font-size:24px">click</a>
<script>
  const WORK = ${WORK}, BUSY = ${q.get('load') === 'busy' ? BUSY : 0}, LEAVE = ${JSON.stringify(q.get('leave'))}, DELAY = ${Number(q.get('delay'))};
  const spin = (ms) => { const end = performance.now() + ms; while (performance.now() < end); };
  const keepBusy = () => {
    const stop = performance.now() + BUSY;
    const ch = new MessageChannel();
    ch.port1.onmessage = () => { spin(45); if (performance.now() < stop) ch.port2.postMessage(0); };
    ch.port2.postMessage(0);
  };
  b.addEventListener('click', (event) => {
    if (LEAVE !== 'link') event.preventDefault();
    spin(WORK);
    send({ k: 'clicked' });
    if (BUSY) keepBusy();
    if (LEAVE === 'timer') setTimeout(() => { location.href = '/next'; }, DELAY);
  });
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
    return res.end(page(url.searchParams));
  }
  setTimeout(() => res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end('<!doctype html><title>next</title><p>next'), Number(url.searchParams.get('delay') ?? 0));
});
await new Promise((r) => server.listen(PORT, '127.0.0.1', r));

const browser = await chromium.launch({ channel: 'chromium', headless: !process.env.HEADED });
console.log(`# ${browser.version()} ${process.env.HEADED ? 'headed' : 'new headless'}, repeat ${REPEAT}, click handler ${WORK}ms, busy ${BUSY}ms${RAC ? ', INP reportAllChanges' : ''}`);

const rel = (t, base) => (t === undefined ? '-' : `${t - base}`);
const rows = [];
for (const v of VERSIONS) for (const load of LOADS) for (const { leave, delay } of CASES) {
  for (let i = 0; i < REPEAT; i++) {
    const run = `${v}-${load}-${leave}-${delay}-${i}-${Date.now()}`;
    const context = await browser.newContext();
    const p = await context.newPage();
    await p.goto(`${ORIGIN}/page?${new URLSearchParams({ v, load, leave, delay, run })}`, { waitUntil: 'load' });
    await wait(500);
    await p.click('#b', { noWaitAfter: true });
    if (leave === 'close') {
      await wait(delay);
      await p.close({ runBeforeUnload: false });
    } else {
      await p.waitForURL(/\/next/, { timeout: 15000 });
    }
    await wait(1500);
    await context.close();
    const log = logs.get(run) ?? [];
    const clicked = log.find((o) => o.k === 'clicked')?.t;
    const entry = log.find((o) => o.k === 'entry')?.t;
    const idle = log.find((o) => o.k === 'idle');
    const hide = log.find((o) => o.k === 'pagehide')?.t;
    const inp = log.filter((o) => o.k === 'report' && o.name === 'INP').map((o) => o.value);
    const taken = log.find((o) => o.k === 'taken');
    rows.push({ v, load, leave, delay, i, inp, hidden: hide !== undefined });
    console.log(`${v} ${load} ${leave}:${delay} #${i}: after click, entry ${rel(entry, clicked)}ms, idle ${rel(idle?.t, clicked)}ms${idle?.timeout ? '(timeout)' : ''}, pagehide ${rel(hide, clicked)}ms, taken at hidden ${taken ? `${taken.n}(${taken.dur}ms)` : '-'}, INP [${inp.join(', ')}]`);
  }
}

console.log('\n# INP 보고된 방문 / 방문');
for (const v of VERSIONS) for (const load of LOADS) for (const { leave, delay } of CASES) {
  const rs = rows.filter((r) => r.v === v && r.load === load && r.leave === leave && r.delay === delay);
  const got = rs.filter((r) => r.inp.length > 0);
  console.log(`${v.padEnd(8)} ${load.padEnd(5)} ${`${leave}:${delay}`.padEnd(11)} ${got.length}/${rs.length}  pagehide ${rs.filter((r) => r.hidden).length}/${rs.length}  values ${[...new Set(got.flatMap((r) => r.inp))].join(',')}`);
}
await browser.close();
server.close();

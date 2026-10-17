// 실제 브라우저에서 늦게 그려진 LCP, 탭 복귀 뒤의 CLS 갱신, bfcache 복원을 수집 코드가 어떻게 보내는지 본다.
// demo-web 을 따로 띄워 collector 와 gateway 대신 이 스크립트의 수신 서버로 보내게 하고, 받은 본문으로 판정한다.
// 떠날 때 보낸 요청은 Playwright 의 request 이벤트에 잡히지 않아서다(collector 에는 도착한다).
// 늦은 LCP 에서는 gateway 응답을 10초 늦춘다. 앞 요청의 응답을 기다리면 떠날 때의 마지막 보고가 나가지 못한다(#5, E7).
// 사용: node e12-browser-lifecycle/run.mjs   (#11 확인에는 lab 의 compose 와 demo-web 의 npm run dev 가 필요하다. 약 1분)
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';

import { chromium } from 'playwright';

// collector 와 gateway 는 실제로 origin 이 다르다. 같은 포트로 받으면 늦춘 gateway 응답이 그 origin 의 연결을 잡아 trace 요청까지 막는다.
const COLLECTOR_PORT = 34370;
const GATEWAY_PORT = 34371;
const DEMO = 'http://localhost:5174';
const LAB_DEMO = process.env.DEMO_URL ?? 'http://localhost:5173';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let sent;
let gatewayDelay = 0;
const reset = () => { sent = { spans: [], metrics: [], vitals: [] }; };
reset();
const sink = (req, res) => {
  res.setHeader('access-control-allow-origin', DEMO);
  res.setHeader('access-control-allow-headers', 'content-type');
  if (req.method === 'OPTIONS') return res.writeHead(204).end();
  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    const json = JSON.parse(body);
    if (req.url === '/v1/traces') sent.spans.push(...json.resourceSpans.flatMap((r) => r.scopeSpans.flatMap((s) => s.spans)));
    if (req.url === '/v1/metrics') sent.metrics.push(...json.resourceMetrics.flatMap((r) => r.scopeMetrics.flatMap((s) => s.metrics)));
    if (req.url === '/v1/vitals') sent.vitals.push(...json);
    setTimeout(() => res.writeHead(200, { 'content-type': 'application/json' }).end('{}'), req.url === '/v1/vitals' ? gatewayDelay : 0);
  });
};
const servers = [COLLECTOR_PORT, GATEWAY_PORT].map((port) => createServer(sink).listen(port, '127.0.0.1'));

const vite = spawn(`${import.meta.dirname}/../../demo-web/node_modules/.bin/vite`, ['--port', '5174', '--strictPort'], {
  cwd: `${import.meta.dirname}/../../demo-web`,
  env: { ...process.env, VITE_COLLECTOR_URL: `http://localhost:${COLLECTOR_PORT}`, VITE_GATEWAY_URL: `http://localhost:${GATEWAY_PORT}/v1/vitals` },
  stdio: 'ignore',
});
for (let i = 0; !(await fetch(DEMO).then((r) => r.ok, () => false)); i++) {
  if (i > 50) throw new Error('vite not ready');
  await wait(200);
}

// new headless 여야 bfcache 복원이 일어난다. Playwright 가 기본으로 넣는 --disable-back-forward-cache 도 뺀다.
const browser = await chromium.launch({ channel: 'chromium', ignoreDefaultArgs: ['--disable-back-forward-cache'] });

async function visit(scenario) {
  reset();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__restores = 0;
    addEventListener('pageshow', (event) => { if (event.persisted) window.__restores += 1; });
  });
  const result = await scenario(page);
  await page.goto('about:blank');
  await wait(1500);
  await context.close();
  return { ...sent, result };
}

const ms = (span) => Number(BigInt(span.endTimeUnixNano) - BigInt(span.startTimeUnixNano)) / 1e6;
const points = (metrics, name) => metrics.filter((m) => m.name === name).flatMap((m) => m.histogram.dataPoints);
const checks = [];
const check = (name, ok, detail) => {
  checks.push(ok);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${detail}`);
};

// 1. 늦게 그려진 LCP(#2). 제목이 먼저 그려지고 본문은 5초 뒤. 입력 없이 7초 머문다.
{
  gatewayDelay = 10_000;
  const got = await visit(async (page) => {
    await page.goto(`${DEMO}/?lcp=5000`, { waitUntil: 'load' });
    await wait(7000);
  });
  gatewayDelay = 0;
  const quiet = got.spans.filter((s) => s.name === 'cwv.lcp.quiet').map(ms);
  const final = got.spans.filter((s) => s.name === 'cwv.lcp').map(ms);
  const lcp = points(got.metrics, 'cwv.lcp');
  const reports = got.vitals.filter((v) => v.name === 'LCP');
  check('늦은 LCP: trace 에 잠정값과 정식 값', quiet.length === 1 && final.length === 1 && quiet[0] < 3000 && final[0] >= 5000,
    `cwv.lcp.quiet ${quiet.map(Math.round)}ms, cwv.lcp ${final.map(Math.round)}ms`);
  check('늦은 LCP: OTel histogram 에는 정식 값 하나', lcp.length === 1 && Number(lcp[0].count) === 1 && lcp[0].sum >= 5000,
    `count ${lcp.map((p) => p.count)}, sum ${lcp.map((p) => Math.round(p.sum))}`);
  check('늦은 LCP: gateway 에는 같은 측정의 잠정값 뒤 정식 값(잠정값의 응답 전에 떠남)', reports.length === 2 && reports[0].key === reports[1].key && reports[0].provisional && !reports[1].provisional && reports[1].value >= 5000,
    reports.map((v) => `rev${v.revision} ${Math.round(v.value)}ms${v.provisional ? '(잠정)' : ''}`).join(', '));
}

// 2. 탭 복귀(#3). Playwright 의 Chromium 에서는 탭을 바꾸거나 창을 줄여도 visibilityState 가 visible 로 남는다.
// 그래서 visibilityState 를 덮어쓰고 visibilitychange 를 보낸다. web-vitals 의 hidden 처리는 isTrusted 를 보지 않는다.
{
  const setVisibility = (page, state) => page.evaluate((s) => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => s });
    document.dispatchEvent(new Event('visibilitychange', { bubbles: true }));
  }, state);
  const got = await visit(async (page) => {
    await page.goto(`${DEMO}/`, { waitUntil: 'load' });
    await wait(1000);
    await setVisibility(page, 'hidden');
    await wait(500);
    await setVisibility(page, 'visible');
    await page.evaluate(() => {
      const block = document.createElement('div');
      block.style.height = '300px';
      document.querySelector('#app').prepend(block);
    });
    await wait(1000);
    await setVisibility(page, 'hidden');
    await wait(1000);
  });
  const cls = got.vitals.filter((v) => v.name === 'CLS');
  const otel = points(got.metrics, 'cwv.cls');
  check('탭 복귀: gateway 는 같은 측정의 갱신을 revision 을 올려 받는다', cls.length >= 2 && new Set(cls.map((v) => v.key)).size === 1 && cls.at(-1).value > cls[0].value && cls.at(-1).revision === cls.length,
    cls.map((v) => `rev${v.revision} ${v.value.toFixed(4)}`).join(', '));
  check('탭 복귀: OTel histogram 은 첫 값 하나만 센다(대조군)', otel.length === 1 && Number(otel[0].count) === 1 && otel[0].sum === cls[0]?.value,
    `count ${otel.map((p) => p.count)}, sum ${otel.map((p) => p.sum.toFixed(4))}`);
}

// 3. bfcache 복원(#4). 다른 문서로 갔다가 뒤로, 앞으로, 다시 뒤로 가서 home 을 두 번, product 를 한 번 복원한다.
// 복원에는 load 가 다시 오지 않으므로 commit 까지만 기다린다.
{
  const got = await visit(async (page) => {
    await page.goto(`${DEMO}/`, { waitUntil: 'load' });
    await wait(1500);
    await page.goto(`${DEMO}/product.html`, { waitUntil: 'load' });
    await wait(1500);
    for (const step of ['back', 'forward', 'back']) {
      await (step === 'back' ? page.goBack({ waitUntil: 'commit' }) : page.goForward({ waitUntil: 'commit' }));
      await wait(1500);
    }
    return { restores: await page.evaluate(() => window.__restores) };
  });
  const roots = got.spans.filter((s) => s.name === 'cwv.page');
  const rootIds = new Set(roots.map((s) => s.spanId));
  const traces = new Set(roots.map((s) => s.traceId));
  const orphans = got.spans.filter((s) => s.name !== 'cwv.page' && !rootIds.has(s.parentSpanId));
  const lcpSpans = got.spans.filter((s) => s.name === 'cwv.lcp');
  const lcpKeys = new Set(got.vitals.filter((v) => v.name === 'LCP' && !v.provisional).map((v) => v.key));
  const lcpPerRoot = roots.map((r) => lcpSpans.filter((s) => s.parentSpanId === r.spanId).length);
  check('bfcache: 복원이 일어남', got.result.restores === 2, `마지막 home 문서의 pageshow.persisted ${got.result.restores}번`);
  check('bfcache: 방문마다 root 와 trace 가 따로', roots.length === 5 && traces.size === 5 && orphans.length === 0,
    `root ${roots.length}개, trace ${traces.size}개, root 없는 span ${orphans.length}개(방문 5번 기대)`);
  check('bfcache: 방문마다 LCP 하나', lcpPerRoot.every((n) => n === 1) && lcpKeys.size === 5,
    `root 별 LCP span ${JSON.stringify(lcpPerRoot)}, gateway 정식 LCP 측정 ${lcpKeys.size}개`);
}

await browser.close();
vite.kill();
servers.forEach((server) => server.close());

// 4. loopback 포트(#11). lab 의 dev server 페이지가 127.0.0.1 에만 열린 collector 와 gateway 에 보내는지, 받은 쪽의 지표로 본다.
if (await fetch(LAB_DEMO).then((r) => r.ok, () => false)) {
  const received = async () => {
    const text = await (await fetch('http://localhost:8888/metrics')).text();
    const sum = (re) => text.split('\n').filter((l) => re.test(l)).reduce((n, l) => n + Number(l.split(' ').at(-1)), 0);
    return { spans: sum(/^otelcol_receiver_accepted_spans\{/), points: sum(/^otelcol_receiver_accepted_metric_points\{/), reports: (await (await fetch('http://localhost:4320/stats')).json()).received };
  };
  const before = await received();
  const labBrowser = await chromium.launch();
  const page = await labBrowser.newPage();
  await page.goto(`${LAB_DEMO}/`, { waitUntil: 'load' });
  await wait(1500);
  await page.goto('about:blank');
  await wait(2000);
  await labBrowser.close();
  const after = await received();
  const delta = Object.fromEntries(Object.keys(after).map((k) => [k, after[k] - before[k]]));
  check('loopback 포트로 collector 와 gateway 에 도착(#11)', delta.spans > 0 && delta.points > 0 && delta.reports > 0, `늘어난 수신: ${JSON.stringify(delta)}`);
} else {
  console.log(`SKIP loopback 포트(#11): ${LAB_DEMO} 가 떠 있지 않다`);
}

console.log(`\n${checks.filter(Boolean).length}/${checks.length} 통과`);
if (!checks.every(Boolean)) process.exitCode = 1;

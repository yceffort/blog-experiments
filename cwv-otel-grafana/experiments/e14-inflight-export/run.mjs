// 떠나는 순간 10초 주기 metric export 가 응답을 기다리는 중이면 CLS, INP 가 Mimir 에 도착하지 않는지 본다.
// collector 앞의 프록시(proxy.mjs)가 첫 주기 export 의 응답을 D ms 늦추고, 페이지는 그 export 가 나간 뒤 L ms 에
// 떠난다. L < D 면 forceFlush 가 응답을 기다리는 사이 문서가 사라진다. 방문마다 Mimir 의 지표별 건수 증가와
// 프록시가 받은 요청(시각, 크기, 담긴 지표)을 적는다. 브라우저 쪽 요청은 가로채지 않는다.
//
// demo-web 은 프록시를 보도록 따로 띄운다:
//   cd demo-web && VITE_COLLECTOR_URL=http://localhost:4319 npx vite --port 5174 --strictPort
import { chromium } from 'playwright';

import { counts } from '../lib/mimir.mjs';
import { startProxy } from './proxy.mjs';

const BASE = process.env.DEMO_URL ?? 'http://localhost:5174';
const COLLECTOR = process.env.COLLECTOR_URL ?? 'http://localhost:4318';
const PROXY_PORT = Number(process.env.PROXY_PORT ?? 4319);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// [응답 지연 D, export 뒤 떠나는 시각 L] (ms)
const CONDITIONS = [
  [2000, 500],
  [2000, 1500],
  [2000, 2500],
  [2000, 3500],
  [300, 100],
  [0, 100],
];

const proxy = startProxy({ port: PROXY_PORT, target: COLLECTOR });

async function visit(browser, { delay, leaveAfter }) {
  proxy.reset(delay);
  const firstExport = proxy.waitFor('/v1/metrics');
  const page = await browser.newPage();
  const t0 = Date.now();
  await page.goto(`${BASE}/?lcp=300&slow=250&shift=200`, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.click('#buy');
  const first = await firstExport; // SDK 시작 10초 뒤의 첫 주기 export
  await wait(leaveAfter);
  const leftAt = Date.now() - t0;
  await page.goto('about:blank');
  await wait(500);
  await page.close();
  await wait(8000);
  const requests = proxy.entries().map((e) => ({
    at: e.at - t0,
    path: e.path,
    bytes: e.bytes,
    names: e.names,
    delayed: e.delayed,
    respondedAt: e.respondedAt - t0,
    status: e.status,
  }));
  return { exportAt: first.at - t0, leftAt, requests };
}

const browser = await chromium.launch();
for (const [delay, leaveAfter] of CONDITIONS) {
  for (let run = 1; run <= 2; run += 1) {
    const before = await counts();
    const result = await visit(browser, { delay, leaveAfter });
    const after = await counts();
    const delta = Object.fromEntries(Object.keys(after).map((k) => [k, after[k] - before[k]]));
    console.log(JSON.stringify({ delay, leaveAfter, run, ...result, delta }));
  }
}
await browser.close();
proxy.close();

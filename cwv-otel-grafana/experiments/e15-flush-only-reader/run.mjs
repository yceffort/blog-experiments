// 탭을 숨겼다가(첫 hidden 의 flush) 돌아와 클릭한 뒤, 그 flush 의 응답이 오기 전에 떠날 때
// PeriodicExportingMetricReader 와 FlushOnlyMetricReader(블로그 운영본)의 차이를 본다.
// collector 앞의 프록시(e14 의 proxy.mjs)가 첫 /v1/metrics 응답을 D ms 늦춘다. 떠나는 순간의 flush 가
// 그 응답을 기다리면(PeriodicExportingMetricReader) 문서가 먼저 사라져 두 번째 요청이 나가지 못한다.
// 방문마다 프록시가 받은 metric 요청(시각, 담긴 지표)과 Mimir 의 지표별 건수 증가를 적는다.
//
// demo-web 은 프록시를 보도록 따로 띄운다:
//   cd demo-web && VITE_COLLECTOR_URL=http://localhost:4319 npx vite --port 5174 --strictPort
import { chromium } from 'playwright';

import { startProxy } from '../e14-inflight-export/proxy.mjs';
import { counts } from '../lib/mimir.mjs';

const BASE = process.env.DEMO_URL ?? 'http://localhost:5174';
const COLLECTOR = process.env.COLLECTOR_URL ?? 'http://localhost:4318';
const PROXY_PORT = Number(process.env.PROXY_PORT ?? 4319);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const READERS = ['periodic', 'flush-only'];
// 첫 hidden 의 flush 응답 지연 D (ms). 0 은 대조군이다.
const DELAYS = [5000, 0];

const proxy = startProxy({ port: PROXY_PORT, target: COLLECTOR });

// headless Chromium 은 탭을 바꿔도 hidden 이 되지 않아 visibilityState 를 덮어써 만든다(e12 와 같다).
// 돌아올 때는 덮어쓴 속성을 지워 원래 getter 로 되돌린다. 'visible' 을 다시 덮어쓰면 진짜로 떠날 때도
// visibilityState 가 visible 로 읽혀 web-vitals 와 수집 코드가 hidden 을 보지 못한다.
const setVisibility = (page, state) =>
  page.evaluate((s) => {
    if (s === 'hidden') {
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    } else {
      delete document.visibilityState;
    }
    document.dispatchEvent(new Event('visibilitychange', { bubbles: true }));
  }, state);

async function visit(browser, { reader, delay }) {
  proxy.reset(delay);
  const firstFlush = proxy.waitFor('/v1/metrics');
  const page = await browser.newPage();
  const t0 = Date.now();
  await page.goto(`${BASE}/?reader=${reader}&lcp=300&slow=250&shift=200`, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  // 첫 hidden: web-vitals 가 LCP 와 CLS 를 확정하고, 수집 코드가 metric 을 flush 한다. 이 응답을 D 만큼 늦춘다.
  await setVisibility(page, 'hidden');
  const first = await firstFlush;
  await page.waitForTimeout(300);
  await setVisibility(page, 'visible');
  // 돌아와서 클릭한다. INP 는 다음 hidden 에서 보고된다.
  await page.click('#buy');
  await page.waitForTimeout(1500);
  const leftAt = Date.now() - t0;
  // 떠난다. 진짜 hidden 이 오고 web-vitals 가 INP 를 보고한 뒤 수집 코드가 다시 flush 한다.
  await page.goto('about:blank');
  await wait(500);
  await page.close();
  await wait(8000);
  const requests = proxy
    .entries()
    .filter((e) => e.path === '/v1/metrics')
    .map((e) => ({ at: e.at - t0, names: e.names, delayed: e.delayed, respondedAt: e.respondedAt - t0 }));
  return { firstFlushAt: first.at - t0, leftAt, requests };
}

const browser = await chromium.launch();
for (const reader of READERS) {
  for (const delay of DELAYS) {
    for (let run = 1; run <= 2; run += 1) {
      const before = await counts();
      const result = await visit(browser, { reader, delay });
      const after = await counts();
      const delta = Object.fromEntries(Object.keys(after).map((k) => [k, after[k] - before[k]]));
      console.log(JSON.stringify({ reader, delay, run, ...result, delta }));
    }
  }
}
await browser.close();
proxy.close();

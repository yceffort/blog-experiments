// 페이지를 떠날 때 pagehide 에서도 메트릭을 flush 하면 CLS, INP 가 Mimir 에 도착하지 않는지 본다.
// 페이지 로드 한 번마다 Mimir 의 지표별 건수가 얼마나 늘었는지 세고, 같은 trace 가 Tempo 에 도착했는지도 센다.
import { chromium } from 'playwright';

import { counts } from '../lib/mimir.mjs';
import { spanCounts } from '../lib/tempo.mjs';

const BASE = process.env.DEMO_URL ?? 'http://localhost:5173';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function visit(browser, extra) {
  const page = await browser.newPage();
  await page.goto(`${BASE}/?lcp=300&slow=250&shift=200${extra}`, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.click('#buy');
  // web-vitals 6.2.3 은 상호작용 항목의 처리를 idle 이나 1초 timeout 까지 미룬다(E13). 그 안에 떠나면 INP 가
  // 보고되지 않으므로, 이 실험의 손실과 섞이지 않게 1.5초를 기다린다.
  await page.waitForTimeout(1500);
  await page.goto('about:blank'); // 10초 주기 export 전에 떠난다
  // keepalive 요청은 문서가 사라져도 끝까지 가지만, 브라우저 컨텍스트를 바로 닫으면 아직 나가지 못한 요청이 함께 버려진다.
  await page.waitForTimeout(1500);
  await page.close();
}

const browser = await chromium.launch();
console.log('chromium', browser.version());
for (const [mode, extra] of [['visibilitychange 만', ''], ['pagehide 도', '&pagehideFlush']]) {
  for (let run = 1; run <= 2; run += 1) {
    const start = Math.floor(Date.now() / 1000) - 1;
    const before = await counts();
    await visit(browser, extra);
    await wait(8000);
    const after = await counts();
    const delta = Object.fromEntries(Object.keys(after).map((k) => [k, after[k] - before[k]]));
    console.log(`${mode} #${run} Mimir`, JSON.stringify(delta));
    await wait(20000); // tail sampling 의 decision_wait 15초를 지나 Tempo 에 들어올 때까지
    console.log(`${mode} #${run} Tempo`, JSON.stringify(await spanCounts(start, Math.floor(Date.now() / 1000) + 1)));
  }
}
await browser.close();

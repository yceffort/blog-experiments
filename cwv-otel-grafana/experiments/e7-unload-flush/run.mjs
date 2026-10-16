// 페이지를 떠날 때 pagehide 에서도 메트릭을 flush 하면 CLS, INP 가 Mimir 에 도착하지 않는지 본다.
// 방문 한 번마다 Mimir 의 지표별 건수가 얼마나 늘었는지 센다.
import { chromium } from 'playwright';

import { counts } from '../lib/mimir.mjs';

const BASE = process.env.DEMO_URL ?? 'http://localhost:5173';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function visit(browser, extra) {
  const page = await browser.newPage();
  await page.goto(`${BASE}/?lcp=300&slow=250&shift=200${extra}`, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.click('#buy');
  await page.waitForTimeout(1000);
  await page.goto('about:blank'); // 10초 주기 export 전에 떠난다
  await page.close();
}

const browser = await chromium.launch();
for (const [mode, extra] of [['visibilitychange 만', ''], ['pagehide 도', '&pagehideFlush']]) {
  for (let run = 1; run <= 2; run += 1) {
    const before = await counts();
    await visit(browser, extra);
    await wait(8000);
    const after = await counts();
    const delta = Object.fromEntries(Object.keys(after).map((k) => [k, after[k] - before[k]]));
    console.log(`${mode} #${run}`, JSON.stringify(delta));
  }
}
await browser.close();

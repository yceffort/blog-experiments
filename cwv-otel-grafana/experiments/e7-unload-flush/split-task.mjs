// 페이지를 살려 둔 채 pagehide 와 visibilitychange 를 다른 task 로 보내고, visibilitychange 에서 부른 metric flush 가
// pagehide 에서 보낸 요청의 응답을 기다리는지 본다. 첫 metric 요청의 응답을 RESPONSE_DELAY_MS 만큼 늦추고,
// 두 번째 요청이 그 응답 뒤에야 나가는지 페이지의 resource timing 으로 잰다. trace 요청은 대조군이다.
import { chromium } from 'playwright';

const BASE = process.env.DEMO_URL ?? 'http://localhost:5173';
const DELAY = Number(process.env.RESPONSE_DELAY_MS ?? 2000);

const metricNames = (route) =>
  route.request().postDataJSON().resourceMetrics.flatMap((r) => r.scopeMetrics.flatMap((s) => s.metrics.map((m) => m.name)));
const spanNames = (route) =>
  route.request().postDataJSON().resourceSpans.flatMap((r) => r.scopeSpans.flatMap((s) => s.spans.map((x) => x.name)));

const browser = await chromium.launch();
console.log('chromium', browser.version(), `첫 metric 응답 지연 ${DELAY}ms`);
for (let run = 1; run <= 2; run += 1) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const requests = [];
  await page.route('**/v1/metrics', async (route) => {
    const n = requests.filter((r) => r.kind === 'metrics').length + 1;
    requests.push({ kind: 'metrics', n, names: metricNames(route) });
    if (n === 1) await new Promise((r) => setTimeout(r, DELAY));
    await route.continue();
  });
  await page.route('**/v1/traces', async (route) => {
    requests.push({ kind: 'traces', names: spanNames(route) });
    await route.continue();
  });
  await page.goto(`${BASE}/?lcp=300&slow=250&shift=200&pagehideFlush`, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.click('#buy');
  await page.waitForTimeout(1500);
  const timing = await page.evaluate(async (delay) => {
    const t = { pagehide: +performance.now().toFixed(1) };
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: false }));
    await new Promise((r) => setTimeout(r, 50));
    t.visibilitychange = +performance.now().toFixed(1);
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange', { bubbles: true }));
    await new Promise((r) => setTimeout(r, delay + 2000));
    const resources = performance
      .getEntriesByType('resource')
      .filter((e) => /\/v1\/(metrics|traces)$/.test(e.name) && e.fetchStart >= t.pagehide - 1)
      .map((e) => ({ path: new URL(e.name).pathname, fetchStart: +e.fetchStart.toFixed(1), responseEnd: +e.responseEnd.toFixed(1) }));
    return { ...t, resources };
  }, DELAY);
  console.log(`run ${run}`, JSON.stringify({ ...timing, requests }));
  await context.close();
}
await browser.close();

// demo-web 에 페이지 로드를 반복해 trace 와 메트릭을 쌓는다.
// 사용: node load.mjs [횟수=60] [동시 실행=4]
import { chromium } from 'playwright';

const BASE = process.env.DEMO_URL ?? 'http://localhost:5173';
const total = Number(process.argv[2] ?? 60);
const concurrency = Number(process.argv[3] ?? 4);

const pick = (items) => items[Math.floor(Math.random() * items.length)];
const between = (min, max) => Math.round(min + Math.random() * (max - min));

/** 한 번의 방문. 조건을 섞어 good, needs-improvement, poor 가 모두 나오게 한다. */
function visitPlan() {
  const params = new URLSearchParams({
    ttfb: String(pick([0, 0, 150, 400, 900, 2000])),
    lcp: String(pick([0, 300, 1200, 2200, 3500, 5000])),
    slow: String(pick([0, 40, 120, 250, 450, 700])),
  });
  if (Math.random() < 0.4) params.set('shift', String(between(200, 1500)));
  // 절반은 이미지가 LCP 다. 이미지 응답 지연으로 LCP 의 리소스 다운로드 단계가 생긴다.
  if (Math.random() < 0.5) params.set('img', String(pick([0, 200, 800, 2000])));

  return {
    path: pick(['/', '/product.html']),
    params,
    // 클릭하지 않고 떠나는 방문도 섞는다. 이때 LCP 는 hidden 에서 확정된다.
    click: Math.random() < 0.7,
    stayMs: between(1500, 9000),
  };
}

async function visit(browser, plan) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${BASE}${plan.path}?${plan.params}`, { waitUntil: 'load' });
  // 첫 입력에서 LCP 가 확정되므로, 클릭 시점이 늦게 그려지는 본문보다 앞서면 LCP 는 제목이 된다.
  const clickAt = between(800, plan.stayMs);
  await page.waitForTimeout(clickAt);
  if (plan.click) await page.click('#buy');
  await page.waitForTimeout(plan.stayMs - clickAt);
  // 다른 문서로 이동하면 떠나는 문서에 visibilitychange(hidden) 와 pagehide 가 온다.
  await page.goto('about:blank');
  await page.waitForTimeout(300);
  await context.close();
}

const browser = await chromium.launch();
let done = 0;
await Promise.all(
  Array.from({ length: concurrency }, async () => {
    while (done < total) {
      done += 1;
      await visit(browser, visitPlan()).catch((error) => console.error(error.message));
    }
  }),
);
await browser.close();
console.log(`visits: ${done}`);

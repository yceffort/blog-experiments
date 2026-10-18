// Grafana 대시보드와 패널을 PNG 로 남긴다. 사용: node screenshots.mjs <출력 디렉터리> [light|dark] [이름,이름...]
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { chromium } from 'playwright';

const GRAFANA = process.env.GRAFANA_URL ?? 'http://localhost:3000';
const [outDir, theme = 'light', only] = process.argv.slice(2);
const picked = only ? new Set(only.split(',')) : null;
if (!outDir) throw new Error('출력 디렉터리를 넘겨야 한다');
mkdirSync(outDir, { recursive: true });

// [파일 이름, 대시보드 uid, 패널 제목(없으면 대시보드 전체), 폭, 높이]
// 패널 id 는 grafana/dashboards 의 JSON 에서 제목으로 찾는다. id 를 직접 적으면 패널 하나만 끼어도 다른 패널을 찍는다.
const SHOTS = [
  ['ops-dashboard', 'cwv-ops', null, 1600, 2050],
  ['why-dashboard', 'cwv-why', null, 1600, 1950],
  // 슬라이드용: 대시보드 위쪽만 16:9 로
  ['ops-top', 'cwv-ops', null, 1600, 900],
  ['why-top', 'cwv-why', null, 1600, 900],
  ['ops-p75-stats', 'cwv-ops', ['LCP p75', 'INP p75', 'CLS p75', 'FCP p75', 'TTFB p75'], 1600, 200],
  ['ops-lcp-trend', 'cwv-ops', 'LCP p75 추이', 1100, 420],
  ['ops-route-lcp', 'cwv-ops', '화면별 LCP p75', 800, 360],
  ['why-lcp-target-count', 'cwv-why', 'LCP 요소별 건수', 1100, 440],
  ['why-lcp-target-p75', 'cwv-why', 'LCP 요소별 p75', 1100, 440],
  ['why-lcp-render-delay', 'cwv-why', '렌더링 지연', 800, 360],
  ['why-slow-lcp-table', 'cwv-why', '느린 LCP (2.5초 초과)', 1400, 460],
];

function panelId(uid, title) {
  const { panels } = JSON.parse(readFileSync(new URL(`../grafana/dashboards/${uid}.json`, import.meta.url), 'utf8'));
  const panel = panels.find((p) => p.title === title);
  if (!panel) throw new Error(`${uid}: "${title}" 패널이 없다`);
  return panel.id;
}

const range = 'from=now-1h&to=now';
const browser = await chromium.launch();

async function shot(name, url, width, height) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000); // 패널 쿼리와 애니메이션이 끝날 때까지
  await page.screenshot({ path: join(outDir, `${name}.png`) });
  await page.close();
}

for (const [name, uid, panel, width, height] of SHOTS) {
  if (picked && !picked.has(name)) continue;
  if (panel === null) {
    await shot(name, `${GRAFANA}/d/${uid}?orgId=1&${range}&kiosk&theme=${theme}`, width, height);
  } else if (Array.isArray(panel)) {
    // stat 여러 개는 한 줄로 이어 붙이지 않고 각각 남긴다. 파일 이름의 숫자는 패널 id 다.
    for (const title of panel) {
      const id = panelId(uid, title);
      await shot(`${name}-${id}`, `${GRAFANA}/d-solo/${uid}?orgId=1&${range}&panelId=${id}&theme=${theme}`, 320, height);
    }
  } else {
    await shot(name, `${GRAFANA}/d-solo/${uid}?orgId=1&${range}&panelId=${panelId(uid, panel)}&theme=${theme}`, width, height);
  }
  console.log('saved', name);
}
await browser.close();

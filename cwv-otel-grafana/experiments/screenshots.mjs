// Grafana 대시보드와 패널을 PNG 로 남긴다. 사용: node screenshots.mjs <출력 디렉터리> [light|dark] [이름,이름...]
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { chromium } from 'playwright';

const GRAFANA = process.env.GRAFANA_URL ?? 'http://localhost:3000';
const [outDir, theme = 'light', only] = process.argv.slice(2);
const picked = only ? new Set(only.split(',')) : null;
if (!outDir) throw new Error('출력 디렉터리를 넘겨야 한다');
mkdirSync(outDir, { recursive: true });

// [파일 이름, 대시보드 uid, 패널 id(없으면 대시보드 전체), 폭, 높이]
const SHOTS = [
  ['ops-dashboard', 'cwv-ops', null, 1600, 2050],
  ['why-dashboard', 'cwv-why', null, 1600, 1950],
  // 슬라이드용: 대시보드 위쪽만 16:9 로
  ['ops-top', 'cwv-ops', null, 1600, 900],
  ['why-top', 'cwv-why', null, 1600, 900],
  ['ops-p75-stats', 'cwv-ops', [2, 3, 4, 5, 6], 1600, 200],
  ['ops-lcp-trend', 'cwv-ops', 14, 1100, 420],
  ['ops-route-lcp', 'cwv-ops', 20, 800, 360],
  ['why-lcp-target-count', 'cwv-why', 2, 1100, 440],
  ['why-lcp-target-p75', 'cwv-why', 3, 1100, 440],
  ['why-lcp-render-delay', 'cwv-why', 8, 800, 360],
  ['why-slow-lcp-table', 'cwv-why', 17, 1400, 460],
];

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
    // stat 여러 개는 한 줄로 이어 붙이지 않고 각각 남긴다
    for (const id of panel) {
      await shot(`${name}-${id}`, `${GRAFANA}/d-solo/${uid}?orgId=1&${range}&panelId=${id}&theme=${theme}`, 320, height);
    }
  } else {
    await shot(name, `${GRAFANA}/d-solo/${uid}?orgId=1&${range}&panelId=${panel}&theme=${theme}`, width, height);
  }
  console.log('saved', name);
}
await browser.close();

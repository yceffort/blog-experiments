// 클릭 한 번 뒤 추가 입력이 없으면 idle 이 언제 오는지, 다음 입력(마우스 이동)이 오면 바로 오는지 본다.
// 사용: node e13-report-timing/idle-until-input.mjs   (HEADED=1 이면 창을 띄운다. 약 35초)
import { createServer } from 'node:http';
import { chromium } from 'playwright';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const html = `<!doctype html><meta charset="utf-8"><button id="b" style="font-size:24px">click</button><script>
  window.out = [];
  b.addEventListener('click', () => {
    const t = performance.now();
    setTimeout(() => requestIdleCallback((d) => out.push({ from: 'click', ms: Math.round(performance.now() - t), timeout: d.didTimeout }), { timeout: 15000 }), 1000);
  });
</script>`;
const server = createServer((req, res) => res.writeHead(200, { 'content-type': 'text/html' }).end(html)).listen(34385, '127.0.0.1');
const browser = await chromium.launch({ channel: 'chromium', headless: !process.env.HEADED });
for (const moveAt of [0, 6000]) {
  const p = await browser.newPage();
  await p.goto('http://127.0.0.1:34385/', { waitUntil: 'load' });
  await wait(500);
  const t0 = Date.now();
  await p.click('#b');
  if (moveAt) { await wait(moveAt); await p.mouse.move(5, 5); }
  await wait(16500 - (Date.now() - t0));
  console.log(`${browser.version()} ${process.env.HEADED ? 'headed' : 'headless'}, ${moveAt ? `마우스 이동 ${moveAt}ms` : '추가 입력 없음'}: idle 콜백(클릭 1초 뒤에 걺, timeout 15초) ${JSON.stringify(await p.evaluate(() => out))}`);
  await p.close();
}
await browser.close(); server.close();

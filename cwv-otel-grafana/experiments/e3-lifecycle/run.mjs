// 페이지를 떠날 때 어떤 이벤트가 어떤 순서로, 어느 대상(window, document)에서 불리는지 기록한다.
// 떠나는 문서의 console 은 잡히지 않으므로 sessionStorage 에 남기고 같은 origin 으로 돌아와 읽는다.
import { chromium } from 'playwright';

const ORIGIN = 'http://lifecycle.test';
const PAGE = `<!doctype html><title>lifecycle</title><body><a id="next" href="/read">next</a><script>
  const log = (label) => {
    const list = JSON.parse(sessionStorage.getItem('log') ?? '[]');
    list.push(label + ':' + document.visibilityState);
    sessionStorage.setItem('log', JSON.stringify(list));
  };
  sessionStorage.removeItem('log');
  for (const type of ['pagehide', 'visibilitychange', 'beforeunload', 'unload']) {
    window.addEventListener(type, () => log('window.capture.' + type), true);
    window.addEventListener(type, () => log('window.' + type));
    document.addEventListener(type, () => log('document.' + type));
  }
</script></body>`;

const browser = await chromium.launch();
console.log('chromium', browser.version());

for (let run = 1; run <= 2; run += 1) {
  const context = await browser.newContext();
  await context.route(`${ORIGIN}/**`, (route) =>
    route.fulfill({ contentType: 'text/html', body: route.request().url().endsWith('/read') ? '<title>read</title>' : PAGE }),
  );
  const page = await context.newPage();
  await page.goto(`${ORIGIN}/`);
  await page.click('#next');
  await page.waitForURL(`${ORIGIN}/read`);
  console.log(`run ${run}`, await page.evaluate(() => sessionStorage.getItem('log')));
  await context.close();
}
await browser.close();

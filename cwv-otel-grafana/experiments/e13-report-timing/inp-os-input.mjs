// run.mjs 의 "클릭 핸들러가 location.href 변경" 조건을 OS 마우스 이벤트 클릭으로 다시 잰다(한가한 페이지만).
// 방문마다 DevTools 를 붙이지 않은 Chrome Beta 를 새 프로필로 띄우고, 클릭 뒤에는 입력을 넣지 않는다.
// 사용: node inp-os-input.mjs   (REPEAT, CASES=버전:지연,... 로 범위를 바꾼다. macOS 전용. 먼저 swiftc -O os-click.swift -o os-click)
import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';

const BIN = process.env.BIN ?? '/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta';
const CLICK = new URL('./os-click', import.meta.url).pathname;
const REPEAT = Number(process.env.REPEAT ?? 5);
const CASES = (process.env.CASES ?? 'v6.2.3:300,v6.2.3:1500,e773747:300').split(',').map((c) => c.split(':'));
const WORK = 200;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const page = (q) => `<!doctype html><meta charset="utf-8"><title>e13</title>
<style>html,body{margin:0;height:100%}button{width:100%;height:100%;font-size:32px}</style>
<script src="/vendor/web-vitals-${q.get('v')}.iife.js"></script>
<script>
  const send = (o) => navigator.sendBeacon('/log', JSON.stringify({ run: ${JSON.stringify(q.get('run'))}, t: Math.round(performance.now()), ...o }));
  webVitals.onINP((m) => send({ k: 'INP', value: m.value }));
  addEventListener('pagehide', () => send({ k: 'pagehide' }), true);
  addEventListener('load', () => send({ k: 'load', screenX, screenY, outerWidth, outerHeight, innerWidth, innerHeight }));
  for (const type of ['pointermove', 'keydown', 'wheel']) addEventListener(type, () => send({ k: type }), true);
</script>
<button id="b">click</button>
<script>
  const spin = (ms) => { const end = performance.now() + ms; while (performance.now() < end); };
  b.addEventListener('click', (e) => {
    spin(${WORK});
    send({ k: 'click', trusted: e.isTrusted });
    setTimeout(() => { location.href = '/next'; }, ${Number(q.get('delay'))});
  });
</script>`;

const logs = [];
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (url.pathname === '/log') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => { logs.push(JSON.parse(body)); res.writeHead(204).end(); });
    return;
  }
  if (url.pathname.startsWith('/vendor/')) return res.writeHead(200, { 'content-type': 'text/javascript' }).end(readFileSync(new URL(`.${url.pathname}`, import.meta.url)));
  if (url.pathname === '/page') return res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(page(url.searchParams));
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end('<!doctype html><title>next</title><p>next');
}).listen(34388, '127.0.0.1');

const until = async (f, ms = 20000) => {
  for (const end = Date.now() + ms; !f(); await wait(100)) if (Date.now() > end) throw new Error('timeout');
};
const cursor = execFileSync(CLICK, ['where']).toString().trim().split(' ');
console.log(`# ${execFileSync(BIN, ['--version']).toString().trim()}, OS 마우스 이벤트 클릭, 클릭 핸들러 ${WORK}ms, 한가한 페이지`);

const rows = [];
try {
  for (const [v, delay] of CASES) for (let i = 0; i < REPEAT; i++) {
    const run = `${v}-${delay}-${i}-${Date.now()}`;
    const of = (k) => logs.find((o) => o.run === run && o.k === k);
    const proc = spawn(BIN, [
      `--user-data-dir=${mkdtempSync(`${process.env.TMPDIR}/e13-os-`)}`, '--no-first-run', '--no-default-browser-check',
      '--window-position=200,150', '--window-size=900,700', `http://127.0.0.1:34388/page?${new URLSearchParams({ v, delay, run })}`,
    ], { stdio: 'ignore' });
    const click = (x, y) => execFileSync(CLICK, ['click', String(Math.round(x)), String(Math.round(y)), String(proc.pid)]);
    try {
      await until(() => of('load'));
      const g = of('load');
      await wait(1000);
      click(g.screenX + g.outerWidth * 0.6, g.screenY + 20); // 창을 앞으로
      await wait(1000);
      click(g.screenX + g.innerWidth / 2, g.screenY + g.outerHeight - g.innerHeight + g.innerHeight / 2);
      await until(() => of('pagehide'), 10000);
      await wait(1500);
    } finally {
      proc.kill();
    }
    const c = of('click');
    const inp = logs.filter((o) => o.run === run && o.k === 'INP').map((o) => o.value);
    const moved = logs.filter((o) => o.run === run && o.k !== 'load' && ['pointermove', 'keydown', 'wheel'].includes(o.k) && o.t > c.t);
    rows.push({ v, delay, inp });
    console.log(`${v} ${delay}ms #${i}: trusted=${c.trusted}, pagehide 클릭 뒤 ${of('pagehide').t - c.t}ms, 클릭 뒤 입력 ${moved.length}, INP [${inp.join(', ')}]`);
    await wait(500);
  }
} finally {
  execFileSync(CLICK, ['warp', ...cursor]);
  server.close();
}

console.log('\n# INP 보고된 방문 / 방문');
for (const [v, delay] of CASES) {
  const rs = rows.filter((r) => r.v === v && r.delay === delay);
  console.log(`${v} ${delay}ms: ${rs.filter((r) => r.inp.length).length}/${rs.length}`);
}

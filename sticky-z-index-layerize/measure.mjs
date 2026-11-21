// usage: PORT=9222 [VIEWPORT='{"width":390,"height":844,"deviceScaleFactor":1,"mobile":true}'] node measure.mjs <url> [seconds]
// 새 탭에서 390x844 DPR 3 모바일 화면(VIEWPORT로 바꿀 수 있다), CPU 4배 감속으로 트레이스를 찍는다.
// Layerize 중 PaintArtifactCompositor::Update 를 품은 것(전체 경로)만 골라 1회 평균을 낸다.
const [url, secs = '10'] = process.argv.slice(2);
const base = `http://127.0.0.1:${process.env.PORT ?? 9222}`;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const { Browser } = await (await fetch(`${base}/json/version`)).json();
const target = await (await fetch(`${base}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const events = [];
let done;
ws.onmessage = ({ data }) => {
  const m = JSON.parse(data);
  if (m.id && pending.has(m.id)) return pending.get(m.id)(m.result ?? m.error), pending.delete(m.id);
  if (m.method === 'Tracing.dataCollected') events.push(...m.params.value);
  if (m.method === 'Tracing.tracingComplete') done();
};
await new Promise(r => (ws.onopen = r));
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', process.env.VIEWPORT ? JSON.parse(process.env.VIEWPORT) : { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
await send('Emulation.setCPUThrottlingRate', { rate: 4 });
await send('Page.navigate', { url });
await sleep(4000);
await send('Tracing.start', { transferMode: 'ReportEvents', traceConfig: { includedCategories: ['devtools.timeline', 'blink'] } });
await sleep(Number(secs) * 1000);
const complete = new Promise(r => (done = r));
await send('Tracing.end');
await complete;
await fetch(`${base}/json/close/${target.id}`);

const names = new Map(events.filter(e => e.ph === 'M' && e.name === 'thread_name').map(e => [`${e.pid}:${e.tid}`, e.args.name]));
const mains = [...names].filter(([, v]) => v === 'CrRendererMain').map(([k]) => events.filter(e => `${e.pid}:${e.tid}` === k && e.ph === 'X'));
const main = mains.sort((a, b) => b.length - a.length)[0];
const layerize = main.filter(e => e.name === 'Layerize');
const update = main.filter(e => e.name === 'PaintArtifactCompositor::Update');
const full = layerize.filter(l => update.some(u => u.ts >= l.ts && u.ts + u.dur <= l.ts + l.dur));
const ms = full.reduce((a, e) => a + e.dur, 0) / 1e3;
console.log(JSON.stringify({ browser: Browser, query: new URL(url).search.slice(1), full: full.length, fullAvgMs: +(ms / Math.max(1, full.length)).toFixed(3) }));
process.exit(0);

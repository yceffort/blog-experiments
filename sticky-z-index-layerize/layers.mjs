// usage: PORT=9222 node layers.mjs <url>
// 합성 레이어 목록을 그리는 순서대로 뽑아, 레이어 수와 sticky 레이어 뒤에 생긴 레이어의 합성 이유를 적는다.
const [url] = process.argv.slice(2);
const base = `http://127.0.0.1:${process.env.PORT ?? 9222}`;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const target = await (await fetch(`${base}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
let layers = null;
ws.onmessage = ({ data }) => {
  const m = JSON.parse(data);
  if (m.id && pending.has(m.id)) return pending.get(m.id)(m.result ?? m.error), pending.delete(m.id);
  if (m.method === 'LayerTree.layerTreeDidChange' && m.params.layers) layers = m.params.layers;
};
await new Promise(r => (ws.onopen = r));
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send('Page.enable');
await send('DOM.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
await send('Page.navigate', { url });
await sleep(4000);
await send('LayerTree.enable');
for (let i = 0; i < 20 && !layers; i++) await sleep(200);

const list = [];
for (const l of layers) {
  const { compositingReasonIds = [] } = await send('LayerTree.compositingReasons', { layerId: l.layerId });
  let node = '';
  if (l.backendNodeId) {
    const { node: n } = await send('DOM.describeNode', { backendNodeId: l.backendNodeId });
    const attrs = Object.fromEntries((n?.attributes ?? []).flatMap((v, i, a) => (i % 2 ? [] : [[v, a[i + 1]]])));
    node = (n?.localName ?? '') + (attrs.id ? `#${attrs.id}` : '') + (attrs.class ? `.${attrs.class.split(/\s+/).join('.')}` : '');
  }
  list.push({ node, reasons: compositingReasonIds, sticky: !!l.stickyPositionConstraint });
}
await fetch(`${base}/json/close/${target.id}`);

const at = list.findIndex(l => l.sticky);
console.log(JSON.stringify({ query: new URL(url).search.slice(1), count: list.length, afterSticky: list.slice(at + 1).map(l => `${l.node || '(no node)'} ${l.reasons.join(',')}`), list }));
process.exit(0);

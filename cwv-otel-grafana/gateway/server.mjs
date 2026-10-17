// 브라우저의 CWV 보고를 받아 모으고, 누적 히스토그램으로 collector 에 내보낸다. 사용: node gateway/server.mjs
import { createServer } from 'node:http';

import { createAggregator, toOtlp } from './aggregator.mjs';

const PORT = Number(process.env.PORT ?? 4320);
const OTLP_URL = process.env.OTLP_URL ?? 'http://localhost:4318/v1/metrics';
const FINALIZE_MS = Number(process.env.FINALIZE_MS ?? 30 * 60_000);
const EXPORT_MS = Number(process.env.EXPORT_MS ?? 10_000);
const SERVICE_NAME = process.env.SERVICE_NAME ?? 'cwv-gateway';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173';

const aggregator = createAggregator({ finalizeMs: FINALIZE_MS });
const startNs = BigInt(Date.now()) * 1_000_000n;

const server = createServer((req, res) => {
  // 브라우저는 preflight 가 없도록 text/plain 으로 보낸다. 응답은 읽지 않지만 CORS 오류가 남지 않게 허용한다.
  res.setHeader('access-control-allow-origin', ALLOWED_ORIGIN);
  if (req.method === 'GET' && req.url === '/stats') {
    res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify(aggregator.stats()));
    return;
  }
  if (req.method !== 'POST' || req.url !== '/v1/vitals') {
    res.writeHead(404).end();
    return;
  }
  let body = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 64_000) req.destroy();
  });
  req.on('end', () => {
    let reports;
    try {
      reports = JSON.parse(body);
    } catch {
      res.writeHead(400).end();
      return;
    }
    if (!Array.isArray(reports)) {
      res.writeHead(400).end();
      return;
    }
    const now = Date.now();
    for (const report of reports) aggregator.receive(report, now);
    res.writeHead(204).end();
  });
});

// 내보내기는 한 번에 하나씩 한다. 같은 시리즈의 샘플이 시각 순서대로 쌓여야 Mimir 가 받는다.
let exporting = Promise.resolve();
function exportOnce() {
  exporting = exporting.then(async () => {
    const now = Date.now();
    aggregator.finalizeDue(now);
    const { body, exported } = toOtlp(aggregator, { serviceName: SERVICE_NAME, startNs, nowNs: BigInt(now) * 1_000_000n });
    const res = await fetch(OTLP_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`collector ${res.status}: ${await res.text()}`);
    exported();
  }).catch((error) => console.error('export 실패', error.message));
  return exporting;
}
const timer = setInterval(exportOnce, EXPORT_MS);

// 확정하지 않은 측정은 메모리에만 있으므로 재시작하면 잃는다. 확정해 둔 값은 마지막으로 한 번 내보낸다.
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    clearInterval(timer);
    server.close();
    exportOnce().finally(() => process.exit(0));
  });
}

server.listen(PORT, () => console.log(`cwv-gateway :${PORT} -> ${OTLP_URL}, 확정 ${FINALIZE_MS}ms, 내보내기 ${EXPORT_MS}ms`));

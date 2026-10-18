// 브라우저의 CWV 보고를 받아 모으고, 누적 히스토그램으로 collector 에 내보낸다. 사용: node gateway/server.mjs
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';

import { createAggregator, toOtlp } from './aggregator.mjs';

const PORT = Number(process.env.PORT ?? 4320);
// 직접 실행하면 이 기기 안에서만 받는다. 컨테이너 안에서는 0.0.0.0 으로 열고 포트 publish 를 127.0.0.1 로 막는다.
const HOST = process.env.HOST ?? '127.0.0.1';
const OTLP_URL = process.env.OTLP_URL ?? 'http://localhost:4318/v1/metrics';
const FINALIZE_MS = Number(process.env.FINALIZE_MS ?? 30 * 60_000);
const EXPORT_MS = Number(process.env.EXPORT_MS ?? 10_000);
const SERVICE_NAME = process.env.SERVICE_NAME ?? 'cwv-gateway';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173';
// 확정한 측정의 key 와 아직 collector 에 값이 실리지 않은 표본을 저장하는 파일. 없으면 재시작한 뒤 같은 보고가
// 다시 오면 한 번 더 세고, 실리지 않은 표본은 잃는다.
const STATE_FILE = process.env.STATE_FILE;

const saved = STATE_FILE && existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE, 'utf8')) : {};
// 이전 형식은 확정 key 배열만 저장했다.
const state = Array.isArray(saved) ? { finalized: saved } : saved;
const aggregator = createAggregator({ finalizeMs: FINALIZE_MS, finalized: state.finalized, unsent: state.unsent });
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

// 확정 key 와 unsent 표본을 저장한다. 내보내기 성공 여부와 무관하게 부른다. 실패하면 exported() 가 불리지 않아
// unsent 가 그대로 남고, 누적값 재전송은 같은 값이라 중복 집계가 없다. 바뀐 것이 없으면 쓰지 않는다.
let lastSaved;
function saveState() {
  if (!STATE_FILE) return;
  const state = JSON.stringify({ finalized: aggregator.finalizedKeys(), unsent: aggregator.unsent() });
  if (state === lastSaved) return;
  writeFileSync(`${STATE_FILE}.tmp`, state);
  renameSync(`${STATE_FILE}.tmp`, STATE_FILE);
  lastSaved = state;
}

// 내보내기는 한 번에 하나씩 한다. 같은 시리즈의 샘플이 시각 순서대로 쌓여야 Mimir 가 받는다.
// collector 요청은 EXPORT_MS 안에 끝나지 않으면 끊는다. 응답 없는 collector 를 기다리다 SIGTERM 처리가 멈추지 않게 한다.
let exporting = Promise.resolve();
function exportOnce() {
  exporting = exporting.then(async () => {
    const now = Date.now();
    aggregator.finalizeDue(now);
    const { body, exported } = toOtlp(aggregator, { serviceName: SERVICE_NAME, startNs, nowNs: BigInt(now) * 1_000_000n });
    try {
      const res = await fetch(OTLP_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(EXPORT_MS) });
      if (!res.ok) throw new Error(`collector ${res.status}: ${await res.text()}`);
      exported();
    } finally {
      saveState();
    }
  }).catch((error) => console.error('export 실패', error.message));
  return exporting;
}
const timer = setInterval(exportOnce, EXPORT_MS);

// 확정하지 않은 측정은 메모리에만 있으므로 재시작하면 잃는다. 확정해 둔 값은 마지막으로 한 번 내보내고,
// 그때 실리지 못한 표본은 저장해 두었다가 다음에 시작하면 내보낸다.
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    clearInterval(timer);
    server.close();
    exportOnce().finally(() => process.exit(0));
  });
}

server.listen(PORT, HOST, () => console.log(`cwv-gateway ${HOST}:${PORT} -> ${OTLP_URL}, 확정 ${FINALIZE_MS}ms, 내보내기 ${EXPORT_MS}ms, 확정 key ${aggregator.finalizedKeys().length}개, 미전송 표본 ${aggregator.unsent().length}개 이어받음`));

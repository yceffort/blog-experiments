// tail sampling(판정 대기 15초, span 2개 이상 정책)이 페이지 trace 를 언제 버리고 언제 살리는지 본다.
// 사용: node e1-tail-sampling/run.mjs   (lab 의 compose 가 떠 있어야 한다)
import { execFileSync } from 'node:child_process';

import { newSpanId, newTraceId, send, span, storedSpanNames, wait } from '../lib/otlp.mjs';

const SMALL = 'http://localhost:14318';
const LATE_MS = 90_000;

function startSmallCollector() {
  execFileSync('docker', ['rm', '-f', 'e1-small-collector'], { stdio: 'ignore' });
  execFileSync('docker', [
    'run', '-d', '--name', 'e1-small-collector', '--network', 'cwv-otel-grafana_default', '-p', '127.0.0.1:14318:4318',
    '-v', `${import.meta.dirname}/collector-small.yaml:/etc/otelcol/config.yaml:ro`,
    'otel/opentelemetry-collector-contrib:0.163.1', '--config=/etc/otelcol/config.yaml',
  ]);
}

/** 페이지 trace 하나: root 와 지표 span 을 만드는 도구 */
function pageTrace() {
  const traceId = newTraceId();
  const rootId = newSpanId();
  return {
    traceId,
    root: () => span(traceId, 'cwv.page', { spanId: rootId, durationMs: 2000 }),
    child: (name) => span(traceId, name, { parent: rootId }),
  };
}

const cases = {
  // root 와 FCP 를 한 요청으로, 90초 뒤 LCP 를 따로
  A: async () => {
    const t = pageTrace();
    await send([t.root(), t.child('cwv.fcp')]);
    await wait(LATE_MS);
    await send([t.child('cwv.lcp')]);
    return t.traceId;
  },
  // root 를 먼저, 5초 뒤 FCP 를 따로(둘 다 판정 전)
  B: async () => {
    const t = pageTrace();
    await send([t.root()]);
    await wait(5000);
    await send([t.child('cwv.fcp')]);
    return t.traceId;
  },
  // root 만 먼저, 90초 뒤 LCP
  C: async () => {
    const t = pageTrace();
    await send([t.root()]);
    await wait(LATE_MS);
    await send([t.child('cwv.lcp')]);
    return t.traceId;
  },
};

/** 판정 뒤 다른 trace 들에 밀려난 다음 늦은 span 이 오는 경우. late 는 늦게 함께 보내는 span 이름들 */
async function evicted(late) {
  const t = pageTrace();
  await send([t.root(), t.child('cwv.fcp')], SMALL);
  await wait(20_000); // 판정이 끝날 때까지
  for (let i = 0; i < 10; i += 1) {
    const filler = pageTrace();
    await send([filler.root(), filler.child('cwv.fcp')], SMALL);
  }
  await send(late.map((name) => t.child(name)), SMALL);
  return t.traceId;
}

startSmallCollector();
await wait(3000);

for (let run = 1; run <= 2; run += 1) {
  const ids = await Promise.all([
    ...Object.values(cases).map((fn) => fn()),
    evicted(['cwv.lcp']),
    evicted(['cwv.cls', 'cwv.inp']),
  ]);
  await wait(25_000); // 마지막으로 보낸 span 의 판정 대기와 Tempo 반영
  const labels = ['A', 'B', 'C', 'D 밀려난 뒤 LCP 하나', 'E 밀려난 뒤 CLS, INP 함께'];
  for (const [i, id] of ids.entries()) {
    console.log(`run ${run} ${labels[i]}:`, JSON.stringify(await storedSpanNames(id)));
  }
}

execFileSync('docker', ['rm', '-f', 'e1-small-collector'], { stdio: 'ignore' });

// 분포를 아는 span 을 10초마다 네 곳에 똑같이 보낸다. 사용: node send.mjs [분=65]
// 값은 100, 300, 1000, 2500, 4000ms 를 돌아가며 쓴다. 정확한 p75 는 2500ms(근사 없이 순위로 고르면)다.
import { newSpanId, newTraceId, send } from '../lib/otlp.mjs';

const TARGETS = {
  'tempo 3.1.0 (collector 경유)': 'http://localhost:4318',
  'tempo 2.10.8 default': 'http://localhost:34301',
  'tempo 2.10.8 noflush': 'http://localhost:34302',
  'tempo 2.10.8 flush': 'http://localhost:34303',
};
const VALUES_MS = [100, 300, 1000, 2500, 4000];
const minutes = Number(process.argv[2] ?? 65);
const until = Date.now() + minutes * 60_000;

const nanos = (ms) => String(BigInt(Math.round(ms)) * 1_000_000n);

for (let i = 0; Date.now() < until; i += 1) {
  const value = VALUES_MS[i % VALUES_MS.length];
  const end = Date.now();
  const traceId = newTraceId();
  const rootId = newSpanId();
  const attrs = [{ key: 'e5.value_ms', value: { doubleValue: value } }];
  const spans = [
    { traceId, spanId: rootId, name: 'e5.page', kind: 1, startTimeUnixNano: nanos(end - 5000), endTimeUnixNano: nanos(end) },
    { traceId, spanId: newSpanId(), parentSpanId: rootId, name: 'e5.value', kind: 1, startTimeUnixNano: nanos(end - value), endTimeUnixNano: nanos(end), attributes: attrs },
  ];
  await Promise.all(
    Object.entries(TARGETS).map(([label, url]) => send(spans, url, 'lab-e5').catch((e) => console.error(label, e.message))),
  );
  await new Promise((r) => setTimeout(r, 10_000));
}
console.log('done');

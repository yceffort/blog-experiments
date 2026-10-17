// delta 히스토그램을 드문드문 보내고, collector 가 누적으로 바꿔 Mimir 에 쓴 값이 공백 뒤에 어떻게 되는지 본다.
// 같은 일정을 max_stale 기본값(5분) collector 와 15분 collector 에 동시에 보낸다. 약 23분 걸린다.
import { execFileSync } from 'node:child_process';

import { query } from '../lib/mimir.mjs';

const TARGETS = { max_stale_5m: 'http://localhost:4318', max_stale_15m: 'http://localhost:24318' };
// 분 단위 송신 시각. 0~4.5 는 5분 안쪽 간격, 그 뒤 6분 공백 두 번, 1분, 5.5분(만료 검사 주기에 따라 갈리는 구간)
const SCHEDULE_MIN = [0, 1, 2, 4.5, 10.5, 16.5, 17, 22.5];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const nanos = (ms) => String(BigInt(Math.round(ms)) * 1_000_000n);

async function sendDelta(url, pipeline, runId, nowMs) {
  const body = {
    resourceMetrics: [{
      resource: { attributes: [{ key: 'service.name', value: { stringValue: 'lab-e4' } }] },
      scopeMetrics: [{
        metrics: [{
          name: 'lab.e4.events',
          unit: '1',
          histogram: {
            aggregationTemporality: 1, // DELTA
            dataPoints: [{
              attributes: [
                { key: 'pipeline', value: { stringValue: pipeline } },
                { key: 'run', value: { stringValue: runId } },
              ],
              startTimeUnixNano: nanos(nowMs - 1000),
              timeUnixNano: nanos(nowMs),
              count: '1',
              sum: 100,
              bucketCounts: ['0', '1', '0'],
              explicitBounds: [50, 200],
            }],
          },
        }],
      }],
    }],
  };
  const res = await fetch(`${url}/v1/metrics`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`${pipeline} ${res.status}`);
}

execFileSync('docker', ['rm', '-f', 'e4-stale15m'], { stdio: 'ignore' });
execFileSync('docker', ['run', '-d', '--name', 'e4-stale15m', '--network', 'cwv-otel-grafana_default', '-p', '24318:4318',
  '-v', `${import.meta.dirname}/collector-stale15m.yaml:/etc/otelcol/config.yaml:ro`,
  'otel/opentelemetry-collector-contrib:0.162.0', '--config=/etc/otelcol/config.yaml']);
await wait(4000);

const runId = process.argv[2] ?? 'a';
const start = Date.now();
for (const minute of SCHEDULE_MIN) {
  await wait(Math.max(0, start + minute * 60_000 - Date.now()));
  const now = Date.now();
  await Promise.all(Object.entries(TARGETS).map(([pipeline, url]) => sendDelta(url, pipeline, runId, now)));
  console.log(`${runId} sent at +${minute}m`);
}
await wait(30_000);

const end = Math.floor(Date.now() / 1000);
const windowSec = Math.ceil((Date.now() - start) / 1000) + 60;
for (const pipeline of Object.keys(TARGETS)) {
  const [series] = await query(`lab_e4_events_count{pipeline="${pipeline}",run="${runId}"}[${windowSec}s]`, end);
  const samples = series.values.map(([t, v]) => [Math.round(t - start / 1000), Number(v)]);
  const [inc] = await query(`increase(lab_e4_events_count{pipeline="${pipeline}",run="${runId}"}[${windowSec}s])`, end);
  const [res] = await query(`resets(lab_e4_events_count{pipeline="${pipeline}",run="${runId}"}[${windowSec}s])`, end);
  console.log(`run ${runId} ${pipeline}: 보낸 건수 ${SCHEDULE_MIN.length}, 값 ${JSON.stringify(samples.map(([, v]) => v))}, increase ${Number(inc.value[1]).toFixed(2)}, resets ${res.value[1]}`);
}
execFileSync('docker', ['rm', '-f', 'e4-stale15m'], { stdio: 'ignore' });

// 방문이 드문 사이트에서 Mimir 의 increase() 가 페이지 로드를 몇 건으로 세는지, 세 가지 수집 경로로 비교한다.
// 사용: node e8-sparse-counts/run.mjs a   (lab 의 compose 가 떠 있어야 한다. 약 16분)
import { execFileSync } from 'node:child_process';

const NET = 'cwv-otel-grafana_default';
const COLLECTOR = 'otel/opentelemetry-collector-contrib:0.163.1';
const PIPELINES = {
  // lab 과 같다: max_stale 5분, remote write
  lab: { collector: 'http://localhost:4318', mimir: 'http://localhost:9009/prometheus', tenant: 'demo' },
  // max_stale 만 7일
  long_stale: { collector: 'http://localhost:34318', mimir: 'http://localhost:39009/prometheus', tenant: 'long-stale' },
  // max_stale 7일 + Mimir OTLP 엔드포인트, 시작 시각을 0 샘플로 넣는다
  otlp_zero: { collector: 'http://localhost:34319', mimir: 'http://localhost:39009/prometheus', tenant: 'otlp-zero' },
  // delta_to_cumulative 없이 delta 를 그대로 저장한다. 건수는 increase() 대신 sum_over_time() 으로 센다
  native_delta: { collector: 'http://localhost:34320', mimir: 'http://localhost:39010/prometheus', tenant: 'native-delta', delta: true },
};
const CONTAINERS = ['e8-mimir', 'e8-mimir-delta', 'e8-long-stale', 'e8-otlp-zero', 'e8-native-delta'];
// 분 단위 송신 시각과 방문 라벨. s1~s5 는 라벨 조합마다 한 번, s6 은 7분 간격으로 세 번(max_stale 5분을 넘는다)
const VISITS = [[0, 's1'], [0, 's6'], [1, 's2'], [2, 's3'], [3, 's4'], [4, 's5'], [7, 's6'], [14, 's6']];
const BOUNDS = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 7000, 10000];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const nanos = (ms) => String(BigInt(Math.round(ms)) * 1_000_000n);

function docker(...args) {
  execFileSync('docker', args, { stdio: 'ignore' });
}

function start() {
  for (const name of CONTAINERS) docker('rm', '-f', name);
  docker('run', '-d', '--name', 'e8-mimir-delta', '--network', NET, '-p', '127.0.0.1:39010:9009',
    '-v', `${import.meta.dirname}/../../mimir/mimir.yaml:/etc/mimir.yaml:ro`,
    'grafana/mimir:3.2.2', '-config.file=/etc/mimir.yaml',
    '-distributor.otel-native-delta-ingestion=true',
    '-distributor.otel-metric-suffixes-enabled=true');
  docker('run', '-d', '--name', 'e8-native-delta', '--network', NET, '-p', '127.0.0.1:34320:4318',
    '-v', `${import.meta.dirname}/collector-native-delta.yaml:/etc/otelcol/config.yaml:ro`, COLLECTOR, '--config=/etc/otelcol/config.yaml');
  docker('run', '-d', '--name', 'e8-mimir', '--network', NET, '-p', '127.0.0.1:39009:9009',
    '-v', `${import.meta.dirname}/../../mimir/mimir.yaml:/etc/mimir.yaml:ro`,
    'grafana/mimir:3.2.2', '-config.file=/etc/mimir.yaml',
    '-distributor.otel-created-timestamp-zero-ingestion-enabled=true',
    '-distributor.otel-metric-suffixes-enabled=true');
  docker('run', '-d', '--name', 'e8-long-stale', '--network', NET, '-p', '127.0.0.1:34318:4318',
    '-v', `${import.meta.dirname}/collector-long-stale.yaml:/etc/otelcol/config.yaml:ro`, COLLECTOR, '--config=/etc/otelcol/config.yaml');
  docker('run', '-d', '--name', 'e8-otlp-zero', '--network', NET, '-p', '127.0.0.1:34319:4318',
    '-v', `${import.meta.dirname}/collector-otlp-zero.yaml:/etc/otelcol/config.yaml:ro`, COLLECTOR, '--config=/etc/otelcol/config.yaml');
}

async function sendLcp(url, runId, visit, nowMs) {
  const bucketCounts = BOUNDS.map(() => '0').concat('0');
  bucketCounts[3] = '1'; // 1800ms 는 (1500, 2000] 버킷
  const body = {
    resourceMetrics: [{
      resource: { attributes: [{ key: 'service.name', value: { stringValue: 'lab-e8' } }] },
      scopeMetrics: [{
        metrics: [{
          name: 'cwv.lcp',
          unit: 'ms',
          histogram: {
            aggregationTemporality: 1, // DELTA
            dataPoints: [{
              attributes: [
                { key: 'run', value: { stringValue: runId } },
                { key: 'visit', value: { stringValue: visit } },
              ],
              startTimeUnixNano: nanos(nowMs - 3000),
              timeUnixNano: nanos(nowMs),
              count: '1',
              sum: 1800,
              bucketCounts,
              explicitBounds: BOUNDS,
            }],
          },
        }],
      }],
    }],
  };
  const res = await fetch(`${url}/v1/metrics`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
}

async function query({ mimir, tenant }, promql, time) {
  const params = new URLSearchParams({ query: promql, time: String(time) });
  const res = await fetch(`${mimir}/api/v1/query?${params}`, { headers: { 'X-Scope-OrgID': tenant } });
  const body = await res.json();
  if (body.status !== 'success') throw new Error(`${promql}: ${body.error}`);
  return body.data.result;
}

// 실행마다 새 라벨을 쓴다. lab collector 는 계속 떠 있어서 같은 라벨을 5분 안에 다시 쓰면 앞 실행의 누적 상태를 이어받는다(E8).
const runId = `${process.argv[2] ?? 'run'}-${Date.now().toString(36)}`;
start();
await wait(8000);

const t0 = Date.now();
for (const [minute, visit] of VISITS) {
  await wait(Math.max(0, t0 + minute * 60_000 - Date.now()));
  const now = Date.now();
  await Promise.all(Object.values(PIPELINES).map((p) => sendLcp(p.collector, runId, visit, now)));
  console.log(`${runId} +${minute}m ${visit}`);
}
await wait(45_000);

const end = Math.floor(Date.now() / 1000);
const range = `${Math.ceil((Date.now() - t0) / 60_000) + 2}m`;
for (const [name, p] of Object.entries(PIPELINES)) {
  const sel = `cwv_lcp_milliseconds_count{run="${runId}"}`;
  const samples = await query(p, `count_over_time(${sel}[${range}])`, end);
  const raw = await query(p, `${sel}[${range}]`, end);
  const fn = p.delta ? 'sum_over_time' : 'increase';
  const total = await query(p, `sum(${fn}(${sel}[${range}]))`, end);
  const p75 = await query(p, `histogram_quantile(0.75, sum by (le) (${fn}(cwv_lcp_milliseconds_bucket{run="${runId}"}[${range}])))`, end);
  const perVisit = Object.fromEntries(raw.map((s) => [s.metric.visit, s.values.map(([, v]) => Number(v))]).sort());
  console.log(`run ${runId} ${name}: 보낸 8건, 시리즈 ${samples.length}, 값 ${JSON.stringify(perVisit)}, sum(${fn}) ${total.length ? Number(total[0].value[1]).toFixed(2) : '없음'}, p75 ${p75.length ? Number(p75[0].value[1]).toFixed(0) : '없음'}`);
}

for (const name of CONTAINERS) docker('rm', '-f', name);

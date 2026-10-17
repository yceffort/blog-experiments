// 시계가 어긋난 브라우저 셋이 같은 라벨 조합으로 LCP 를 보낼 때 몇 건이 남는지, 수집 경로별로 본다.
// 사용: node e9-client-clock/run.mjs a   (lab 의 compose 가 떠 있어야 한다. 약 1분)
import { execFileSync } from 'node:child_process';

const NET = 'cwv-otel-grafana_default';
const COLLECTOR = 'otel/opentelemetry-collector-contrib:0.163.1';
const CONTAINERS = ['e9-mimir', 'e9-client-time', 'e9-receive-time'];
const PIPELINES = {
  // lab 과 같다: delta_to_cumulative, remote write
  lab: { collector: 'http://localhost:4318', mimir: 'http://localhost:9009/prometheus', tenant: 'demo', fn: 'increase' },
  // delta 를 그대로 저장, 브라우저 시각 그대로
  client_time: { collector: 'http://localhost:34331', mimir: 'http://localhost:39011/prometheus', tenant: 'client-time', fn: 'sum_over_time' },
  // delta 를 그대로 저장, collector 가 받은 시각으로 바꿈
  receive_time: { collector: 'http://localhost:34332', mimir: 'http://localhost:39011/prometheus', tenant: 'receive-time', fn: 'sum_over_time' },
};
// 보내는 순서와 각 브라우저 시계의 어긋남(초). 둘째 브라우저는 2분 늦고, 셋째는 30초 빠르다.
const BROWSERS = [['a', 0], ['b', -120], ['c', 30]];
const BOUNDS = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 7000, 10000];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const nanos = (ms) => String(BigInt(Math.round(ms)) * 1_000_000n);
const docker = (...args) => execFileSync('docker', args, { stdio: 'ignore' });

function start() {
  for (const name of CONTAINERS) docker('rm', '-f', name);
  docker('run', '-d', '--name', 'e9-mimir', '--network', NET, '-p', '39011:9009',
    '-v', `${import.meta.dirname}/../../mimir/mimir.yaml:/etc/mimir.yaml:ro`,
    'grafana/mimir:3.2.2', '-config.file=/etc/mimir.yaml',
    '-distributor.otel-native-delta-ingestion=true', '-distributor.otel-metric-suffixes-enabled=true');
  for (const [name, port] of [['client-time', 34331], ['receive-time', 34332]]) {
    docker('run', '-d', '--name', `e9-${name}`, '--network', NET, '-p', `${port}:4318`,
      '-v', `${import.meta.dirname}/collector-${name}.yaml:/etc/otelcol/config.yaml:ro`, COLLECTOR, '--config=/etc/otelcol/config.yaml');
  }
}

async function sendLcp(url, runId, clockMs) {
  const bucketCounts = BOUNDS.map(() => '0').concat('0');
  bucketCounts[3] = '1';
  const body = {
    resourceMetrics: [{
      resource: { attributes: [{ key: 'service.name', value: { stringValue: 'lab-e9' } }] },
      scopeMetrics: [{
        metrics: [{
          name: 'cwv.lcp',
          unit: 'ms',
          histogram: {
            aggregationTemporality: 1,
            dataPoints: [{
              attributes: [{ key: 'run', value: { stringValue: runId } }],
              startTimeUnixNano: nanos(clockMs - 3000),
              timeUnixNano: nanos(clockMs),
              count: '1', sum: 1800, bucketCounts, explicitBounds: BOUNDS,
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

const runId = `e9-${process.argv[2] ?? 'a'}`;
start();
await wait(8000);
for (const [name, skewSec] of BROWSERS) {
  const clock = Date.now() + skewSec * 1000;
  await Promise.all(Object.values(PIPELINES).map((p) => sendLcp(p.collector, runId, clock)));
  console.log(`${runId} browser ${name} clock ${skewSec >= 0 ? '+' : ''}${skewSec}s`);
  await wait(3000);
}
await wait(20_000);

const end = Math.floor(Date.now() / 1000) + 60;
for (const [name, p] of Object.entries(PIPELINES)) {
  const sel = `cwv_lcp_milliseconds_count{run="${runId}"}`;
  const raw = await query(p, `${sel}[6m]`, end);
  const total = await query(p, `sum(${p.fn}(${sel}[6m]))`, end);
  const values = raw.flatMap((s) => s.values.map(([, v]) => Number(v)));
  console.log(`run ${runId} ${name}: 보낸 3건, 샘플 ${JSON.stringify(values)}, sum(${p.fn}) ${total.length ? Number(total[0].value[1]).toFixed(2) : '없음'}`);
}
const rejected = execFileSync('sh', ['-c', 'docker logs e9-client-time 2>&1'], { encoding: 'utf8' });
console.log(`client_time collector 오류 줄: ${rejected.split('\n').filter((l) => /error/i.test(l)).length}`);
for (const name of CONTAINERS) docker('rm', '-f', name);

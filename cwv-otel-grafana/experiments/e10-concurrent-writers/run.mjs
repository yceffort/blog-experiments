// 여러 브라우저가 같은 라벨 조합(시리즈 하나)에 LCP 를 보낼 때, 수집 경로별로 몇 건이 남는지 본다.
// 사용: node e10-concurrent-writers/run.mjs <scenario> <seed>   (lab 의 compose 가 떠 있어야 한다)
//   jitter      시계는 모두 맞고 네트워크 지연만 다르다. 초당 1, 10, 50건을 각 60초
//   one-fast    초당 2건 120초, 20초에 시계가 60초 빠른 브라우저 하나
//   far-future  초당 1건 420초, 10초에 시계가 2시간 빠른 브라우저 하나
//   skew2014    시계 편차를 2014년 공개 측정 분포에서 뽑는다. 초당 1, 10건을 각 120초
import { execFileSync } from 'node:child_process';
import { claimContainers } from '../lib/docker.mjs';
import { SCENARIOS, events, mulberry32, seedOf, stamps } from './scenarios.mjs';

const NET = 'cwv-otel-grafana_default';
const COLLECTOR = 'otel/opentelemetry-collector-contrib:0.163.1';
const CONTAINERS = ['e10-mimir', 'e10-client-time', 'e10-receive-time'];
const PATHS = {
  lab: { collector: 'http://localhost:4318', mimir: 'http://localhost:9009', tenant: 'demo' },
  client_time: { collector: 'http://localhost:34341', mimir: 'http://localhost:39021', tenant: 'client-time' },
  receive_time: { collector: 'http://localhost:34342', mimir: 'http://localhost:39021', tenant: 'receive-time' },
};
const BOUNDS = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 7000, 10000];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const docker = (...args) => execFileSync('docker', args, { stdio: 'ignore' });

function body(runId, timeMs, startMs) {
  const bucketCounts = BOUNDS.map(() => '0').concat('0');
  bucketCounts[3] = '1';
  const nanos = (ms) => String(BigInt(ms) * 1_000_000n);
  return JSON.stringify({
    resourceMetrics: [{
      resource: { attributes: [{ key: 'service.name', value: { stringValue: 'lab-e10' } }] },
      scopeMetrics: [{
        metrics: [{
          name: 'cwv.lcp',
          unit: 'ms',
          histogram: {
            aggregationTemporality: 1,
            dataPoints: [{
              attributes: [{ key: 'run', value: { stringValue: runId } }],
              startTimeUnixNano: nanos(startMs),
              timeUnixNano: nanos(timeMs),
              count: '1', sum: 1800, bucketCounts, explicitBounds: BOUNDS,
            }],
          },
        }],
      }],
    }],
  });
}

async function scrape(url, prefix) {
  const text = await (await fetch(url)).text();
  return Object.fromEntries(text.split('\n').filter((l) => l.startsWith(prefix)).map((l) => {
    const i = l.lastIndexOf(' ');
    return [l.slice(0, i), Number(l.slice(i + 1))];
  }));
}
const diff = (before, after) =>
  Object.fromEntries(Object.entries(after).map(([k, v]) => [k, v - (before[k] ?? 0)]).filter(([, v]) => v));

async function counters() {
  return {
    d2c: await scrape('http://localhost:8888/metrics', 'otelcol_deltatocumulative_datapoints'),
    lab: await scrape('http://localhost:9009/metrics', 'cortex_discarded_samples_total'),
    e10: await scrape('http://localhost:39021/metrics', 'cortex_discarded_samples_total'),
  };
}

async function query({ mimir, tenant }, promql, time) {
  const params = new URLSearchParams({ query: promql, time: String(time) });
  const res = await fetch(`${mimir}/prometheus/api/v1/query?${params}`, { headers: { 'X-Scope-OrgID': tenant } });
  const result = await res.json();
  if (result.status !== 'success') throw new Error(`${promql}: ${result.error}`);
  return result.data.result;
}
const scalar = async (...args) => {
  const [first] = await query(...args);
  return first ? Number(first.value[1]) : 0;
};

function start() {
  claimContainers(CONTAINERS);
  docker('run', '-d', '--name', 'e10-mimir', '--network', NET, '-p', '127.0.0.1:39021:9009',
    '-v', `${import.meta.dirname}/../../mimir/mimir.yaml:/etc/mimir.yaml:ro`,
    'grafana/mimir:3.2.2', '-config.file=/etc/mimir.yaml',
    '-distributor.otel-native-delta-ingestion=true', '-distributor.otel-metric-suffixes-enabled=true');
  for (const [name, port] of [['client-time', 34341], ['receive-time', 34342]]) {
    docker('run', '-d', '--name', `e10-${name}`, '--network', NET, '-p', `127.0.0.1:${port}:4318`,
      '-v', `${import.meta.dirname}/../e9-client-clock/collector-${name}.yaml:/etc/otelcol/config.yaml:ro`,
      // E9 의 collector 설정을 쓰고 Mimir 주소만 바꾼다. e9-mimir 별칭을 붙이면 E9 와 동시에 돌릴 때 이름이 겹친다.
      COLLECTOR, '--config=/etc/otelcol/config.yaml', '--set=exporters::otlp_http/mimir::endpoint=http://e10-mimir:9009/otlp');
  }
}

async function ready() {
  for (let i = 0; i < 60; i++) {
    const ok = await fetch('http://localhost:39021/ready').then((r) => r.ok, () => false);
    if (ok) return wait(5000);
    await wait(1000);
  }
  throw new Error('e10-mimir not ready');
}

const scenario = process.argv[2];
const seed = process.argv[3] ?? 'a';
if (!SCENARIOS[scenario]) throw new Error(`scenario: ${Object.keys(SCENARIOS).join(' | ')}`);
start();
await ready();

for (const spec of SCENARIOS[scenario]) {
  // 입력은 seed 로 정하고 run 라벨은 실행마다 새로 만든다. lab collector 는 계속 떠 있어서 같은 라벨을 5분 안에
  // 다시 쓰면 앞 실행의 누적 상태를 이어받는다(E8).
  const inputId = `e10-${scenario}-${spec.rate}-${seed}`;
  const runId = `${inputId}-${Date.now().toString(36)}`;
  const list = events(spec, mulberry32(seedOf(inputId)));
  const before = await counters();
  const t0 = Date.now();
  let failed = 0;
  await Promise.all(list.map((e) => wait(e.at + e.delay).then(() => {
    const { time, start } = stamps(e);
    const payload = body(runId, t0 + time, t0 + start);
    return Promise.all(Object.values(PATHS).map((p) =>
      fetch(`${p.collector}/v1/metrics`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: payload })
        .then((res) => { if (!res.ok) failed++; }, () => failed++)));
  })));
  await wait(15_000);
  const after = await counters();

  // 받아들인 표본이 최대 10분 앞설 수 있어(Mimir create-grace-period) 그만큼 뒤 시각에서 조회한다.
  const end = Math.floor(Date.now() / 1000) + 11 * 60;
  const range = `${spec.seconds + 15 * 60}s`;
  const sel = `cwv_lcp_milliseconds_count{run="${runId}"}`;
  const stored = {
    lab: await scalar(PATHS.lab, `max(max_over_time(${sel}[${range}]))`, end),
    client_time: await scalar(PATHS.client_time, `sum(sum_over_time(${sel}[${range}]))`, end),
    receive_time: await scalar(PATHS.receive_time, `sum(sum_over_time(${sel}[${range}]))`, end),
  };
  // lab 의 누적 시리즈에서 표본 시각 사이 가장 긴 공백. 앞선 시계 하나가 시리즈를 얼마나 멈췄는지 본다.
  const times = (await query(PATHS.lab, `${sel}[${range}]`, end)).flatMap((s) => s.values.map(([t]) => t)).sort((a, b) => a - b);
  const gap = Math.max(0, ...times.slice(1).map((t, i) => t - times[i]));
  const skewed = list.filter((e) => e.skew !== 0);
  console.log(`\n${inputId}(라벨 ${runId}): 보낸 ${list.length}건(편차 있는 것 ${skewed.length}, 앞선 것 ${skewed.filter((e) => e.skew > 0).length}), 전송 실패 ${failed}`);
  for (const [name, n] of Object.entries(stored)) {
    console.log(`  ${name.padEnd(12)} 남은 ${n}건, 잃은 비율 ${((1 - n / list.length) * 100).toFixed(1)}%`);
  }
  console.log(`  lab 표본 ${times.length}개, 가장 긴 공백 ${gap.toFixed(1)}초`);
  console.log('  delta_to_cumulative', JSON.stringify(diff(before.d2c, after.d2c)));
  console.log('  Mimir(lab) 버린 표본', JSON.stringify(diff(before.lab, after.lab)));
  console.log('  Mimir(e10) 버린 표본', JSON.stringify(diff(before.e10, after.e10)));
}

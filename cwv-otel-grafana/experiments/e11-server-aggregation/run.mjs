// gateway 가 여러 브라우저의 보고를 모아 시리즈의 유일한 writer 로 내보내면 표본이 남는지 본다.
// 같은 보고를 lab 의 delta 경로(delta_to_cumulative, 대조군)에도 보낸다. 입력의 일부는 E10 과 같은 seed 로 만든다.
// 사용: node e11-server-aggregation/run.mjs <seed>   (lab 의 compose 가 떠 있어야 한다. 약 5분)
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { BUCKETS } from '../../demo-web/src/telemetry/buckets.ts';
import { SCENARIOS, events, mulberry32, seedOf, stamps } from '../e10-concurrent-writers/scenarios.mjs';

const GATEWAY = 'http://localhost:34360';
const COLLECTOR = 'http://localhost:4318';
const MIMIR = 'http://localhost:9009/prometheus';
// 실험을 짧게 하려고 확정까지 2초만 기다린다. lab 의 gateway 는 30분이다.
const FINALIZE_MS = 2000;
const EXPORT_MS = 2000;
const SETTLE_MS = FINALIZE_MS + 3 * EXPORT_MS + 2000;
// 확정한 측정의 key 를 재시작 너머로 넘기는 파일. 실행마다 새로 만든다.
const STATE_FILE = join(mkdtempSync(join(tmpdir(), 'e11-')), 'finalized.json');

const seed = process.argv[2] ?? 'a';
const stamp = Date.now().toString(36);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const rating = (v) => (v > 4000 ? 'poor' : v > 2500 ? 'needs-improvement' : 'good');
const BOUNDS = BUCKETS.LCP;
const bucketOf = (v) => {
  const i = BOUNDS.findIndex((b) => v <= b);
  return i === -1 ? BOUNDS.length : i;
};

let gateway;
async function startGateway() {
  // 포트에 다른 실행의 gateway 가 떠 있으면 그쪽 통계를 읽게 된다.
  if (await fetch(`${GATEWAY}/stats`).then((r) => r.ok, () => false)) throw new Error(`${GATEWAY} 에 다른 gateway 가 떠 있다`);
  gateway = spawn(process.execPath, [`${import.meta.dirname}/../../gateway/server.mjs`], {
    env: { ...process.env, PORT: '34360', FINALIZE_MS: String(FINALIZE_MS), EXPORT_MS: String(EXPORT_MS), SERVICE_NAME: 'lab-e11', OTLP_URL: `${COLLECTOR}/v1/metrics`, STATE_FILE },
    stdio: ['ignore', 'ignore', 'inherit'],
  });
  for (let i = 0; i < 50; i++) {
    if (await fetch(`${GATEWAY}/stats`).then((r) => r.ok, () => false)) return;
    await wait(100);
  }
  throw new Error('gateway not ready');
}
async function stopGateway() {
  const exited = new Promise((r) => gateway.once('exit', r));
  gateway.kill('SIGTERM');
  await exited;
}
const stats = async () => (await fetch(`${GATEWAY}/stats`)).json();
const diff = (before, after) => Object.fromEntries(Object.entries(after).map(([k, v]) => [k, v - (before[k] ?? 0)]).filter(([, v]) => v));

const lcp = (key, revision, value, run, extra = {}) => ({ key, revision, name: 'LCP', value, labels: { run, rating: rating(value) }, ...extra });
async function post(reports) {
  const res = await fetch(`${GATEWAY}/v1/vitals`, { method: 'POST', body: JSON.stringify(reports) });
  if (!res.ok) throw new Error(`gateway ${res.status}`);
}
// 대조군: 브라우저처럼 페이지 로드 하나를 delta 히스토그램 하나로 lab collector 에 보낸다.
function postDelta(run, value, timeMs, startMs) {
  const bucketCounts = BOUNDS.map(() => '0').concat('0');
  bucketCounts[bucketOf(value)] = '1';
  const nanos = (ms) => String(BigInt(ms) * 1_000_000n);
  const attributes = Object.entries({ run, rating: rating(value) }).map(([key, v]) => ({ key, value: { stringValue: v } }));
  return fetch(`${COLLECTOR}/v1/metrics`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      resourceMetrics: [{
        resource: { attributes: [{ key: 'service.name', value: { stringValue: 'lab-e11' } }] },
        scopeMetrics: [{ metrics: [{ name: 'cwv.lcp', unit: 'ms', histogram: {
          aggregationTemporality: 1,
          dataPoints: [{ attributes, startTimeUnixNano: nanos(startMs), timeUnixNano: nanos(timeMs), count: '1', sum: value, bucketCounts, explicitBounds: BOUNDS }],
        } }] }],
      }],
    }),
  });
}

async function query(promql) {
  const params = new URLSearchParams({ query: promql, time: String(Date.now() / 1000) });
  const res = await fetch(`${MIMIR}/api/v1/query?${params}`, { headers: { 'X-Scope-OrgID': 'demo' } });
  const body = await res.json();
  if (body.status !== 'success') throw new Error(`${promql}: ${body.error}`);
  return body.data.result;
}
// 누적값이 줄면(재시작) 앞 구간의 마지막 값을 더한다. 외삽 없이 저장된 샘플만으로 센 값이다.
const total = (values) => {
  let sum = 0;
  values.forEach(([, v], i) => {
    if (i > 0 && Number(v) < Number(values[i - 1][1])) sum += Number(values[i - 1][1]);
  });
  return sum + Number(values.at(-1)[1]);
};
async function storedCount(run, metric = 'cwv_lcp_milliseconds') {
  return (await query(`${metric}_count{run="${run}"}[30m]`)).reduce((n, s) => n + total(s.values), 0);
}
async function storedBuckets(run) {
  const le = Object.fromEntries([...BOUNDS.map(String), '+Inf'].map((b) => [b, 0]));
  for (const s of await query(`cwv_lcp_milliseconds_bucket{run="${run}"}[30m]`)) le[s.metric.le] += total(s.values);
  return Object.values(le);
}
const expectedBuckets = (values) => {
  const counts = Array(BOUNDS.length + 1).fill(0);
  values.forEach((v) => { counts[bucketOf(v)] += 1; });
  return counts.map((_, i) => counts.slice(0, i + 1).reduce((a, b) => a + b));
};

async function report(name, run, sent, before, values, extra = '') {
  await wait(SETTLE_MS);
  const after = await stats();
  const stored = await storedCount(run);
  const control = await storedCount(`${run}-delta`);
  const [inc] = await query(`sum(increase(cwv_lcp_milliseconds_count{run="${run}"}[10m]))`);
  const buckets = await storedBuckets(run);
  const expected = expectedBuckets(values);
  console.log(`\n${name}(라벨 ${run}): 보낸 측정 ${sent}건${extra}`);
  console.log(`  gateway 처리 ${JSON.stringify(diff(before, after))}`);
  console.log(`  저장(gateway) ${stored}건, increase() ${inc ? Number(inc.value[1]).toFixed(2) : '없음'}, 버킷 ${JSON.stringify(buckets) === JSON.stringify(expected) ? '일치' : `불일치 ${JSON.stringify(buckets)} != ${JSON.stringify(expected)}`}`);
  if (control) console.log(`  저장(delta 대조군) ${control}건, 잃은 비율 ${((1 - control / sent) * 100).toFixed(1)}%`);
}

await startGateway();

// 1. 같은 라벨의 독립 보고 30개를 한꺼번에(blog#850 의 재현과 같은 모양)
{
  const run = `e11-burst-${seed}-${stamp}`;
  const before = await stats();
  const now = Date.now();
  await Promise.all(Array.from({ length: 30 }, (_, i) => Promise.all([
    post([lcp(`${run}:${i}`, 1, 1800, run)]),
    postDelta(`${run}-delta`, 1800, now, now - 5000),
  ])));
  await report('burst', run, 30, before, Array(30).fill(1800));
}

// 2. E10 과 같은 입력(같은 seed). 값은 버킷이 섞이도록 따로 뽑는다. gateway 는 브라우저 시각을 쓰지 않는다.
for (const [scenario, rate] of [['jitter', 50], ['skew2014', 10]]) {
  const inputId = `e10-${scenario}-${rate}-${seed}`;
  const list = events(SCENARIOS[scenario].find((s) => s.rate === rate), mulberry32(seedOf(inputId)));
  const valueRand = mulberry32(seedOf(`${inputId}:value`));
  const values = list.map(() => Math.round(200 + 9800 * valueRand()));
  const run = `e11-${scenario}-${rate}-${seed}-${stamp}`;
  const before = await stats();
  const t0 = Date.now();
  await Promise.all(list.map((e, i) => wait(e.at + e.delay).then(() => {
    const { time, start } = stamps(e);
    return Promise.all([post([lcp(`${run}:${i}`, 1, values[i], run)]), postDelta(`${run}-delta`, values[i], t0 + time, t0 + start)]);
  })));
  await report(inputId, run, list.length, before, values);
}

// 3. 갱신, 재전송, 역순 도착, 확정 뒤 갱신. 측정마다 rev1, rev2, rev2(재전송), rev1(늦게 온 이전 값) 순서로 보낸다.
{
  const run = `e11-revisions-${seed}-${stamp}`;
  const rand = mulberry32(seedOf(`e11-revisions-${seed}`));
  const measurements = Array.from({ length: 200 }, (_, i) => ({ key: `${run}:${i}`, first: Math.round(200 + 9800 * rand()), last: Math.round(200 + 9800 * rand()), delay: 2000 * rand() }));
  const before = await stats();
  await Promise.all(measurements.map(async (m) => {
    await wait(m.delay);
    for (const [revision, value] of [[1, m.first], [2, m.last], [2, m.last], [1, m.first]]) await post([lcp(m.key, revision, value, run)]);
  }));
  await wait(SETTLE_MS);
  await Promise.all(measurements.slice(0, 20).map((m) => post([lcp(m.key, 3, 50, run)])));
  const lowered = measurements.filter((m) => m.last < m.first).length;
  await report('revisions', run, 200, before, measurements.map((m) => m.last), `(값이 줄어든 갱신 ${lowered}건, 확정 뒤 갱신 20건)`);
}

// 4. LCP 잠정값. 25건은 잠정값만, 25건은 잠정값 800 뒤 정식 값 6000. 잠정값만 온 측정은 cwv.lcp.provisional 로 따로 센다.
{
  const run = `e11-provisional-${seed}-${stamp}`;
  const before = await stats();
  await Promise.all(Array.from({ length: 50 }, async (_, i) => {
    await post([lcp(`${run}:${i}`, 1, 800, run, { provisional: true })]);
    if (i % 2) await post([lcp(`${run}:${i}`, 2, 6000, run)]);
  }));
  await report('provisional', run, 50, before, Array(25).fill(6000));
  console.log(`  저장(cwv.lcp.provisional) ${await storedCount(run, 'cwv_lcp_provisional_milliseconds')}건`);
}

// 5. 방문이 드문 라벨 조합(E8 의 모양). s1~s5 는 한 번, s6 은 세 번
{
  const run = `e11-sparse-${seed}-${stamp}`;
  const before = await stats();
  const visits = [[0, 's1'], [0, 's6'], [1, 's2'], [2, 's3'], [3, 's4'], [4, 's5'], [7, 's6'], [14, 's6']];
  for (const [i, [second, route]] of visits.entries()) {
    setTimeout(() => post([{ ...lcp(`${run}:${i}`, 1, 1800, run), labels: { run, rating: 'good', 'page.route': route } }]), second * 1000);
  }
  await wait(14_000 + 100);
  await report('sparse', run, visits.length, before, Array(visits.length).fill(1800));
}

// 6. 재시작. 확정한 100건 뒤 재시작하고, 그 100건을 같은 key 와 revision 으로 다시 보낸 뒤 100건을 더 보낸다.
// 마지막 30건은 확정 전에 재시작해 잃는다.
{
  const run = `e11-restart-${seed}-${stamp}`;
  const batch = (from, n) => post(Array.from({ length: n }, (_, i) => lcp(`${run}:${from + i}`, 1, 1800, run)));
  await batch(0, 100);
  await wait(SETTLE_MS);
  await stopGateway();
  await startGateway();
  await batch(0, 100);
  const resent = await stats();
  await batch(100, 100);
  await wait(SETTLE_MS);
  await batch(200, 30);
  await stopGateway();
  await startGateway();
  await report('restart', run, 230, await stats(), Array(200).fill(1800), `(재시작 뒤 다시 보낸 100건은 late ${resent.late}건, accepted ${resent.accepted}건. 마지막 30건은 확정 전에 재시작)`);
}

await stopGateway();

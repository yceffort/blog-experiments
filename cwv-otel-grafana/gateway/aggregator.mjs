// 브라우저 보고를 측정마다 최신값 하나로 모으고, 확정한 값만 시리즈별 누적 히스토그램에 더한다.
//
// 측정은 key(문서, 방문, 지표)로 구분하고 revision 이 지금까지보다 큰 보고만 받는다. 마지막으로 받은 뒤
// finalizeMs 동안 새 보고가 없으면 확정한다. 히스토그램에 넣은 표본은 고칠 수 없으므로, 확정한 뒤에 온
// 보고는 넣지 않고 late 로만 센다. 이 프로세스가 시리즈의 유일한 writer 라서 브라우저가 몇 개든
// 같은 시리즈의 표본이 서로 덮어쓰지 않는다(experiments/e10, e11). 잠정값(LCP quiet)으로만 확정한 측정은
// 정식 값과 섞이지 않게 `cwv.<지표>.provisional` 로 따로 센다.
import { BUCKETS } from '../demo-web/src/telemetry/buckets.ts';

// 라벨 조합 하나가 시리즈 하나다. 브라우저가 보낸 라벨 중 값의 종류가 정해진 것만 받는다. run 은 실험용이다.
const LABELS = new Set(['page.route', 'navigation.type', 'rating', 'interaction.type', 'run']);
const RESULTS = ['accepted', 'updated', 'duplicate', 'stale', 'late', 'overflow', 'invalid'];

function parse(report) {
  if (!report || typeof report !== 'object') return undefined;
  const { key, revision, name, value, labels = {}, provisional = false } = report;
  if (typeof key !== 'string' || !key || key.length > 200) return undefined;
  if (!Number.isInteger(revision) || revision < 1) return undefined;
  // hasOwn 은 키를 문자열로 바꾸므로 ["LCP"] 도 통과한다. 그러면 내보낼 때마다 실패해 다른 표본도 막힌다.
  if (typeof name !== 'string' || !Object.hasOwn(BUCKETS, name) || !Number.isFinite(value) || value < 0) return undefined;
  if (typeof labels !== 'object' || labels === null) return undefined;
  const kept = Object.fromEntries(
    Object.entries(labels).filter(([k, v]) => LABELS.has(k) && typeof v === 'string' && v.length <= 100).sort(),
  );
  return { key, revision, name, value, labels: kept, provisional: provisional === true };
}

export function createAggregator({ finalizeMs, keepFinalizedMs = 24 * 60 * 60_000, maxPending = 100_000, finalized: restored = [], unsent: restoredUnsent = [] }) {
  // 확정 전 측정. key 는 브라우저가 정하므로 maxPending 으로 수를 묶는다. 넘치면 새 key 는 overflow 로 버리고 기존 측정의 갱신은 받는다.
  const pending = new Map();
  // 확정한 측정의 key 와 확정 시각. 늦은 보고를 새 측정으로 세지 않으려고 keepFinalizedMs 동안 들고 있는다.
  // 재시작해도 이어지도록 `finalizedKeys()` 로 꺼내 저장하고 `finalized` 로 넘겨받는다.
  const finalized = new Map(restored);
  const series = new Map();
  const counts = Object.fromEntries([...RESULTS, 'received', 'finalized', 'provisional'].map((k) => [k, 0]));

  function add(m) {
    const { name, value, labels, provisional } = m;
    const id = JSON.stringify([name, provisional, labels]);
    let s = series.get(id);
    if (!s) {
      s = { name, provisional, labels, count: 0, sum: 0, buckets: Array(BUCKETS[name].length + 1).fill(0), exported: false, unsent: [] };
      series.set(id, s);
    }
    const i = BUCKETS[name].findIndex((bound) => value <= bound);
    s.buckets[i === -1 ? BUCKETS[name].length : i] += 1;
    s.count += 1;
    s.sum += value;
    // 값이 collector 에 실릴 때까지 들고 있는다. key 는 이미 확정했으므로, 재시작하면 `unsent()` 로 저장한 것을
    // `unsent` 로 넘겨받아 다시 더한다.
    s.unsent.push(m);
  }
  restoredUnsent.forEach(add);

  return {
    receive(raw, now) {
      counts.received += 1;
      const report = parse(raw);
      const current = report && pending.get(report.key);
      let result;
      if (!report) result = 'invalid';
      else if (finalized.has(report.key)) result = 'late';
      else if (current && report.revision === current.revision) result = 'duplicate';
      else if (current && report.revision < current.revision) result = 'stale';
      else if (!current && pending.size >= maxPending) result = 'overflow';
      else result = current ? 'updated' : 'accepted';
      counts[result] += 1;
      if (result === 'accepted' || result === 'updated') pending.set(report.key, { ...report, at: now });
    },

    finalizeDue(now) {
      for (const [key, m] of pending) {
        if (now - m.at < finalizeMs) continue;
        pending.delete(key);
        finalized.set(key, now);
        add(m);
        counts.finalized += 1;
        if (m.provisional) counts.provisional += 1;
      }
      for (const [key, at] of finalized) if (now - at > keepFinalizedMs) finalized.delete(key);
    },

    series: () => [...series.values()],
    finalizedKeys: () => [...finalized],
    unsent: () => [...series.values()].flatMap((s) => s.unsent),
    stats: () => ({ ...counts, pending: pending.size }),
  };
}

const attributes = (labels) => Object.entries(labels).map(([key, v]) => ({ key, value: { stringValue: v } }));

/**
 * 누적(cumulative) OTLP JSON. 처음 내보내는 시리즈는 값을 0 으로 내보낸다. Prometheus 의 increase() 는
 * 시리즈의 첫 샘플을 기준점으로만 쓰므로, 첫 샘플부터 값이 있으면 그 값을 세지 못한다(experiments/e8).
 * `exported()` 는 collector 가 받은 뒤에 불러야 다음부터 실제 값을 싣는다. 0 으로 내보낸 시리즈의 표본은
 * 실리지 않았으므로 unsent 에 남는다.
 */
export function toOtlp(aggregator, { serviceName, startNs, nowNs }) {
  const list = aggregator.series();
  const carried = list.map((s) => (s.exported ? s.unsent.length : 0));
  const time = { startTimeUnixNano: String(startNs), timeUnixNano: String(nowNs) };
  const metricName = (s) => `cwv.${s.name.toLowerCase()}${s.provisional ? '.provisional' : ''}`;
  const metrics = [...new Set(list.map(metricName))].map((metric) => ({
    name: metric,
    unit: metric.startsWith('cwv.cls') ? '1' : 'ms',
    histogram: {
      aggregationTemporality: 2,
      dataPoints: list.filter((s) => metricName(s) === metric).map((s) => ({
        attributes: attributes(s.labels),
        ...time,
        count: String(s.exported ? s.count : 0),
        sum: s.exported ? s.sum : 0,
        bucketCounts: s.buckets.map((n) => String(s.exported ? n : 0)),
        explicitBounds: BUCKETS[s.name],
      })),
    },
  }));

  const stats = aggregator.stats();
  metrics.push({
    name: 'cwv.gateway.reports',
    unit: '{report}',
    sum: {
      aggregationTemporality: 2,
      isMonotonic: true,
      dataPoints: RESULTS.map((result) => ({ attributes: attributes({ result }), ...time, asInt: String(stats[result]) })),
    },
  });
  metrics.push({ name: 'cwv.gateway.pending', unit: '{measurement}', gauge: { dataPoints: [{ ...time, asInt: String(stats.pending) }] } });

  return {
    body: {
      resourceMetrics: [{
        resource: { attributes: attributes({ 'service.name': serviceName }) },
        scopeMetrics: [{ scope: { name: 'cwv-gateway' }, metrics }],
      }],
    },
    exported: () => list.forEach((s, i) => {
      s.unsent.splice(0, carried[i]);
      s.exported = true;
    }),
  };
}

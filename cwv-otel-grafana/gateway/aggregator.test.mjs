import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createAggregator, toOtlp } from './aggregator.mjs';

const MIN = 60_000;
const report = (key, revision, value, labels = { rating: 'good' }, extra = {}) =>
  ({ key, revision, name: 'CLS', value, labels, ...extra });
const cls = (agg) => agg.series().find((s) => s.name === 'CLS');

describe('createAggregator', () => {
  it('같은 측정의 갱신은 표본 하나로, 확정할 때의 최신값으로 센다', () => {
    const agg = createAggregator({ finalizeMs: 30 * MIN });
    agg.receive(report('d1:0:CLS', 1, 0.01), 0);
    agg.receive(report('d1:0:CLS', 2, 0.4, { rating: 'poor' }), 10 * MIN);

    agg.finalizeDue(39 * MIN);
    assert.equal(agg.series().length, 0);

    agg.finalizeDue(40 * MIN);
    assert.deepEqual(agg.series().map((s) => [s.labels.rating, s.count, s.sum]), [['poor', 1, 0.4]]);
  });

  it('같은 revision 재전송과 늦게 온 이전 revision 은 값을 바꾸지 않는다', () => {
    const agg = createAggregator({ finalizeMs: 1000 });
    agg.receive(report('d1:0:CLS', 2, 0.2), 0);
    agg.receive(report('d1:0:CLS', 2, 0.2), 10);
    agg.receive(report('d1:0:CLS', 1, 0.01), 20);
    agg.finalizeDue(1000);

    assert.deepEqual([cls(agg).count, cls(agg).sum], [1, 0.2]);
    assert.deepEqual(agg.stats(), { received: 3, accepted: 1, updated: 0, duplicate: 1, stale: 1, late: 0, invalid: 0, finalized: 1, provisional: 0, pending: 0 });
  });

  it('값이 줄어든 갱신도 최신값으로 센다(INP 는 상호작용이 늘면 낮아질 수 있다)', () => {
    const agg = createAggregator({ finalizeMs: 1000 });
    agg.receive({ key: 'd1:0:INP', revision: 1, name: 'INP', value: 450, labels: {} }, 0);
    agg.receive({ key: 'd1:0:INP', revision: 2, name: 'INP', value: 180, labels: {} }, 10);
    agg.finalizeDue(2000);

    const inp = agg.series().find((s) => s.name === 'INP');
    assert.deepEqual([inp.count, inp.sum], [1, 180]);
  });

  it('확정한 뒤에 온 보고는 히스토그램에 넣지 않고 late 로 센다', () => {
    const agg = createAggregator({ finalizeMs: 1000 });
    agg.receive(report('d1:0:CLS', 1, 0.01), 0);
    agg.finalizeDue(1000);
    agg.receive(report('d1:0:CLS', 2, 0.4), 1500);
    agg.finalizeDue(5000);

    assert.deepEqual([cls(agg).count, cls(agg).sum], [1, 0.01]);
    assert.equal(agg.stats().late, 1);
  });

  it('라벨이 같은 독립 보고는 모두 더하고, 버킷은 le 경계에 맞춰 센다', () => {
    const agg = createAggregator({ finalizeMs: 0 });
    const values = [500, 501, 1800, 2500, 12_000];
    values.forEach((value, i) => agg.receive({ key: `d${i}:0:LCP`, revision: 1, name: 'LCP', value, labels: { 'page.route': 'home' } }, 0));
    agg.finalizeDue(0);

    const [lcp] = agg.series();
    assert.equal(lcp.count, 5);
    assert.equal(lcp.sum, values.reduce((a, b) => a + b));
    // 경계 [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 7000, 10000] 와 마지막 +Inf
    assert.deepEqual(lcp.buckets, [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1]);
  });

  it('잠정값으로만 남은 측정은 정식 값과 다른 시리즈에 센다', () => {
    const agg = createAggregator({ finalizeMs: 1000 });
    agg.receive({ key: 'd1:0:LCP', revision: 1, name: 'LCP', value: 800, labels: {}, provisional: true }, 0);
    agg.receive({ key: 'd2:0:LCP', revision: 1, name: 'LCP', value: 800, labels: {}, provisional: true }, 0);
    agg.receive({ key: 'd2:0:LCP', revision: 2, name: 'LCP', value: 800, labels: {} }, 10);
    agg.finalizeDue(2000);

    assert.deepEqual(agg.series().map((s) => [s.provisional, s.count]).sort(), [[false, 1], [true, 1]]);
    assert.equal(agg.stats().provisional, 1);
  });

  it('재시작할 때 넘겨받은 확정 key 의 재전송은 다시 세지 않는다', () => {
    const before = createAggregator({ finalizeMs: 0 });
    before.receive(report('d1:0:CLS', 1, 0.1), 0);
    before.finalizeDue(0);

    const after = createAggregator({ finalizeMs: 0, finalized: before.finalizedKeys() });
    after.receive(report('d1:0:CLS', 1, 0.1), 10);
    after.finalizeDue(10);

    assert.deepEqual([after.series().length, after.stats().late], [0, 1]);
  });

  it('형식이 틀린 보고와 허용하지 않은 라벨은 받지 않는다', () => {
    const agg = createAggregator({ finalizeMs: 0 });
    for (const bad of [null, {}, report('', 1, 0.1), report('k', 0, 0.1), report('k', 1, -1), { ...report('k', 1, 0.1), name: 'FID' }, { ...report('k', 1, 0.1), name: ['CLS'] }]) {
      agg.receive(bad, 0);
    }
    agg.receive(report('k', 1, 0.1, { rating: 'good', 'url.full': 'https://example.com/?q=1' }), 0);
    agg.finalizeDue(0);

    assert.equal(agg.stats().invalid, 7);
    assert.deepEqual(cls(agg).labels, { rating: 'good' });
  });
});

describe('toOtlp', () => {
  it('처음 내보내는 시리즈는 0 으로 내보내고, 내보낸 뒤부터 값을 싣는다', () => {
    const agg = createAggregator({ finalizeMs: 0 });
    agg.receive(report('d1:0:CLS', 1, 0.2), 0);
    agg.finalizeDue(0);
    const point = (body) => body.resourceMetrics[0].scopeMetrics[0].metrics.find((m) => m.name === 'cwv.cls').histogram.dataPoints[0];
    const options = { serviceName: 'test', startNs: 0n, nowNs: 1n };

    const first = toOtlp(agg, options);
    assert.deepEqual([point(first.body).count, point(first.body).sum], ['0', 0]);
    assert.deepEqual([point(toOtlp(agg, options).body).count], ['0']);

    first.exported();
    const second = toOtlp(agg, options);
    assert.deepEqual([point(second.body).count, point(second.body).sum, point(second.body).bucketCounts[5]], ['1', 0.2, '1']);
  });

  it('잠정값으로만 확정한 LCP 는 cwv.lcp.provisional 로 내보낸다', () => {
    const agg = createAggregator({ finalizeMs: 0 });
    agg.receive({ key: 'd1:0:LCP', revision: 1, name: 'LCP', value: 800, labels: {}, provisional: true }, 0);
    agg.receive({ key: 'd2:0:LCP', revision: 1, name: 'LCP', value: 800, labels: {} }, 0);
    agg.finalizeDue(0);
    const names = toOtlp(agg, { serviceName: 'test', startNs: 0n, nowNs: 1n }).body.resourceMetrics[0].scopeMetrics[0].metrics
      .filter((m) => m.histogram).map((m) => [m.name, m.histogram.dataPoints.length]);

    assert.deepEqual(names.sort(), [['cwv.lcp', 1], ['cwv.lcp.provisional', 1]]);
  });
});

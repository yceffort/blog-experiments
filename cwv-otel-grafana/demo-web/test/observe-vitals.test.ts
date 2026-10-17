import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { LCPMetricWithAttribution, MetricWithAttribution } from 'web-vitals/attribution';

import { observeVitals } from '../src/telemetry/vitals';

const web = vi.hoisted(() => ({ onTTFB: vi.fn(), onFCP: vi.fn(), onCLS: vi.fn(), onINP: vi.fn(), onLCP: vi.fn() }));
vi.mock('web-vitals/attribution', () => web);

const lcp = (value: number) => ({ name: 'LCP', id: 'v1', value }) as LCPMetricWithAttribution;
type OnReport = (metric: MetricWithAttribution) => void;
const lcpCallback = (reportAllChanges: boolean) =>
  web.onLCP.mock.calls.find(([, opts]) => Boolean(opts?.reportAllChanges) === reportAllChanges)![0] as OnReport;
const callbacks = () => ({ report: vi.fn(), quiet: vi.fn(), update: vi.fn(), flush: vi.fn() });

describe('observeVitals', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    Object.values(web).forEach((fn) => fn.mockReset());
  });

  it('quiet 잠정값은 report 하지 않고, 정식 값 하나만 report 한다', () => {
    const cb = callbacks();
    observeVitals(cb);

    lcpCallback(true)(lcp(800));
    vi.advanceTimersByTime(3000);
    lcpCallback(true)(lcp(6000));
    lcpCallback(false)(lcp(6000));

    expect(cb.quiet).toHaveBeenCalledExactlyOnceWith(lcp(800));
    expect(cb.flush).toHaveBeenCalledOnce();
    expect(cb.report).toHaveBeenCalledExactlyOnceWith(lcp(6000));
    expect(cb.update.mock.calls).toEqual([
      [lcp(800), true],
      [lcp(6000), false],
    ]);
  });

  it('bfcache 복원마다 LCP 정식 값을 하나씩 report 한다', () => {
    const cb = callbacks();
    observeVitals(cb);
    // 복원한 방문의 지표는 web-vitals 가 새 id 와 복원 시각(navigationStartTime)을 붙여 보고한다.
    const visit = (id: string, navigationStartTime: number, value: number) =>
      ({ ...lcp(value), id, navigationStartTime }) as LCPMetricWithAttribution;

    for (const m of [visit('hard', 0, 1200), visit('restore-1', 5000, 40), visit('restore-2', 9000, 30)]) {
      lcpCallback(true)(m);
      lcpCallback(false)(m);
    }
    vi.advanceTimersByTime(10_000);

    expect(cb.report.mock.calls.map(([m]) => m.id)).toEqual(['hard', 'restore-1', 'restore-2']);
  });

  it('탭 복귀 뒤 같은 id 로 다시 온 CLS 는 report 하지 않고 update 로만 넘긴다', () => {
    const cb = callbacks();
    observeVitals(cb);
    const onCLS = web.onCLS.mock.calls[0][0] as OnReport;
    const cls = (value: number) => ({ name: 'CLS', id: 'c1', value }) as MetricWithAttribution;

    onCLS(cls(0.01));
    onCLS(cls(0.4));

    expect(cb.report).toHaveBeenCalledExactlyOnceWith(cls(0.01));
    expect(cb.update.mock.calls).toEqual([
      [cls(0.01), false],
      [cls(0.4), false],
    ]);
  });
});

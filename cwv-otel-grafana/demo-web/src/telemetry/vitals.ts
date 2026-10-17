import {
  type LCPMetricWithAttribution,
  type MetricWithAttribution,
  onCLS,
  onFCP,
  onINP,
  onLCP,
  onTTFB,
} from 'web-vitals/attribution';

import { createLcpGate, type LcpFinalizer } from './lcp-gate';

export type Report = (metric: MetricWithAttribution) => void;

/**
 * 같은 지표 id 는 처음 한 번만 넘긴다. CLS 와 INP 는 페이지가 다시 보였다가 숨으면
 * 같은 id 로 다시 보고된다. 두 번 세면 페이지 하나가 건수 둘이 된다. 대신 뒤의 갱신은 버려지므로,
 * 최신값은 gateway 로 가는 `update` 경로가 센다.
 */
export function oncePerId(report: Report): Report {
  const seen = new Set<string>();

  return (metric) => {
    const key = `${metric.name}:${metric.id}`;
    if (seen.has(key)) return;
    seen.add(key);
    report(metric);
  };
}

interface VitalsCallbacks {
  /** 측정마다 첫 보고. LCP 는 정식 값만 넘긴다. 표본을 고칠 수 없는 OTel histogram 과 trace 에 쓴다. */
  report: Report;
  /** LCP quiet 잠정값 */
  quiet: (metric: LCPMetricWithAttribution) => void;
  /** 같은 측정의 보고 전부. CLS, INP 의 갱신과 LCP 잠정값(`provisional`)도 넘긴다. */
  update: (metric: MetricWithAttribution, provisional: boolean) => void;
  /** quiet 직후에 부른다. 기다리는 동안 앱이 닫히면 잠정값이 유실된다. */
  flush: () => void;
}

export function observeVitals({ report, quiet, update, flush }: VitalsCallbacks): void {
  const once = oncePerId(report);
  const both: Report = (metric) => {
    once(metric);
    update(metric, false);
  };

  onTTFB(both);
  onFCP(both);
  onCLS(both);
  onINP(both);

  const emit = (metric: LCPMetricWithAttribution, by: LcpFinalizer) => {
    update(metric, by === 'quiet');
    if (by === 'web-vitals') {
      report(metric);
    } else {
      quiet(metric);
      flush();
    }
  };
  // bfcache 에서 복원하면 web-vitals 는 LCP 를 새 id 로 다시 잰다. 두 observer 의 id 는 서로 달라서
  // 복원 시각(navigationStartTime)으로 같은 방문을 묶고 방문마다 gate 를 따로 둔다.
  const gates = new Map<number, ReturnType<typeof createLcpGate>>();
  const gateOf = (metric: LCPMetricWithAttribution) => {
    const visit = metric.navigationStartTime ?? 0;
    if (!gates.has(visit)) gates.set(visit, createLcpGate(emit));
    return gates.get(visit)!;
  };
  onLCP((metric) => gateOf(metric).final(metric));
  onLCP((metric) => gateOf(metric).candidate(metric), { reportAllChanges: true });
}

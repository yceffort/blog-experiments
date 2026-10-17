import type { LCPMetricWithAttribution } from 'web-vitals/attribution';

export type LcpFinalizer = 'web-vitals' | 'quiet';

/**
 * LCP 정식 값은 페이지당 한 번 내보내고, 그 전에 후보가 `quietMs` 동안 바뀌지 않으면 그 후보를 잠정값으로 내보낸다.
 *
 * web-vitals 는 첫 입력이나 hidden 에서 LCP 를 확정한다. 앱 웹뷰를 입력 없이 떠나면서
 * hidden 이 오지 않으면 LCP 는 영영 확정되지 않으므로 잠정값이라도 남긴다. 후보가 멈췄다고
 * LCP 가 끝난 것은 아니라서(더 큰 요소가 나중에 그려질 수 있다) 잠정값은 정식 확정을 막지 않는다.
 * 새 후보가 오면 타이머를 다시 건다.
 */
export function createLcpGate(
  emit: (metric: LCPMetricWithAttribution, finalizedBy: LcpFinalizer) => void,
  quietMs = 3000,
) {
  let finalized = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  return {
    /** `onLCP(..., { reportAllChanges: true })` 의 후보 */
    candidate(metric: LCPMetricWithAttribution) {
      if (finalized) return;
      clearTimeout(timer);
      timer = setTimeout(() => emit(metric, 'quiet'), quietMs);
    },
    /** `onLCP(...)` 의 정식 확정값 */
    final(metric: LCPMetricWithAttribution) {
      if (finalized) return;
      finalized = true;
      clearTimeout(timer);
      emit(metric, 'web-vitals');
    },
  };
}

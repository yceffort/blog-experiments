import { type Attributes, type Context, ROOT_CONTEXT, trace, type Tracer } from '@opentelemetry/api';

/**
 * 방문 하나를 trace 하나로 묶는다. 방문은 처음 로드와 bfcache 복원이다. 지표 span 은 모두 그 방문의 `cwv.page` 의 자식이다.
 *
 * root 는 방문의 첫 지표가 나올 때 만들고 그 자리에서 끝낸다. 첫 지표 span 도 같은 tick 에 끝나므로
 * BatchSpanProcessor 의 같은 배치로 나간다. tail sampling 이 판정할 때 이 trace 에는
 * span 이 이미 두 개 있다. root 를 페이지 시작 때 따로 보내면 혼자 판정받아 trace 째 버려진다.
 *
 * span 길이는 지표 값이다. 그래서 TraceQL 에서 `duration` 분위수가 곧 지표 분위수가 된다.
 */
export function createPageTrace(tracer: Tracer, getBaseAttributes: () => Attributes) {
  const visits = new Map<number, { parent: Context; base: Attributes }>();

  /** `visitStart` 는 방문이 시작된 시각(timeOrigin 기준 ms)이다. web-vitals 의 `navigationStartTime` 을 넘긴다. */
  return function record(name: string, durationMs: number, attributes: Attributes, visitStart = 0): void {
    let visit = visits.get(visitStart);
    if (!visit) {
      const root = tracer.startSpan('cwv.page', { startTime: performance.timeOrigin + visitStart });
      root.end();
      visit = { parent: trace.setSpan(ROOT_CONTEXT, root), base: getBaseAttributes() };
      visits.set(visitStart, visit);
    }

    const end = performance.timeOrigin + performance.now();
    tracer
      .startSpan(name, { startTime: end - durationMs, attributes: { ...visit.base, ...attributes } }, visit.parent)
      .end(end);
  };
}

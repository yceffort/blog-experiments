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
  const visits = new Map<number, { parent: Context; base: Attributes; start: number }>();

  /** `visitStart` 는 방문이 시작된 시각(timeOrigin 기준 ms)이다. web-vitals 의 `navigationStartTime` 을 넘긴다. */
  return function record(name: string, durationMs: number, attributes: Attributes, visitStart = 0): void {
    let visit = visits.get(visitStart);
    if (!visit) {
      const start = performance.timeOrigin + visitStart;
      const root = tracer.startSpan('cwv.page', { startTime: start });
      root.end();
      visit = { parent: trace.setSpan(ROOT_CONTEXT, root), base: getBaseAttributes(), start };
      visits.set(visitStart, visit);
    }

    // 지표 span 은 보고 시각에 끝나고 길이가 값이다. CLS 는 점수를 ms 로 바꾼 길이라 방문 시작(root)보다 앞서
    // 시작할 수 있는데, 그때는 방문 시작에서 시작하도록 span 을 뒤로 민다. 길이는 그대로다.
    const start = Math.max(performance.timeOrigin + performance.now() - durationMs, visit.start);
    tracer
      .startSpan(name, { startTime: start, attributes: { ...visit.base, ...attributes } }, visit.parent)
      .end(start + durationMs);
  };
}

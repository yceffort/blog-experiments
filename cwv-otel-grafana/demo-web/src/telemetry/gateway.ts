import type { MetricWithAttribution } from 'web-vitals/attribution';

import { toLabels } from './labels';

/**
 * 지표 보고를 gateway(`gateway/server.mjs`)로 보낸다. gateway 가 측정마다 최신값 하나를 골라 세므로
 * CLS, INP 의 갱신과 LCP 잠정값도 모두 보낸다.
 *
 * 측정 key 는 문서, 방문, 지표 이름이다. web-vitals 의 id 는 observer 마다 달라서 LCP 잠정값과 정식 값을
 * 같은 측정으로 묶지 못한다. 방문은 bfcache 복원 시각(navigationStartTime)으로 나눈다. 같은 측정의 보고는
 * revision 을 하나씩 올리고, gateway 는 이미 받은 것보다 큰 revision 만 받는다.
 *
 * 요청은 서로 기다리지 않으므로, 떠날 때 보내는 마지막 보고가 앞 요청의 응답에 묶이지 않는다(experiments/e7).
 * 본문을 문자열로 넘기면 text/plain 이라 CORS preflight 가 없다.
 */
export function createGatewaySender(url: string, route: string) {
  const documentId = crypto.randomUUID();
  const revisions = new Map<string, number>();
  let queue: object[] = [];

  const send = () => {
    const body = JSON.stringify(queue);
    queue = [];
    fetch(url, { method: 'POST', body, keepalive: true }).catch(() => {});
  };

  return (metric: MetricWithAttribution, provisional: boolean): void => {
    const key = `${documentId}:${metric.navigationStartTime ?? 0}:${metric.name}`;
    const revision = (revisions.get(key) ?? 0) + 1;
    revisions.set(key, revision);
    if (!queue.length) queueMicrotask(send);
    queue.push({ key, revision, name: metric.name, value: metric.value, provisional, labels: toLabels(metric, route) });
  };
}

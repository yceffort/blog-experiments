import { randomBytes } from 'node:crypto';

export const COLLECTOR = process.env.COLLECTOR_URL ?? 'http://localhost:4318';
const TEMPO = process.env.TEMPO_URL ?? 'http://localhost:3200';

export const newTraceId = () => randomBytes(16).toString('hex');
export const newSpanId = () => randomBytes(8).toString('hex');
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** 지금 끝나는 span 하나. 길이를 지표 값으로 쓰는 수집 코드와 같은 모양이다. */
export function span(traceId, name, { parent, spanId = newSpanId(), durationMs = 100 } = {}) {
  const end = BigInt(Date.now()) * 1_000_000n;
  return {
    traceId,
    spanId,
    parentSpanId: parent,
    name,
    kind: 1,
    startTimeUnixNano: String(end - BigInt(Math.round(durationMs * 1e6))),
    endTimeUnixNano: String(end),
  };
}

/** span 들을 OTLP/HTTP JSON 요청 하나로 보낸다. 브라우저의 export 호출 한 번과 같다. */
export async function send(spans, collector = COLLECTOR, serviceName = 'lab-otlp') {
  const res = await fetch(`${collector}/v1/traces`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      resourceSpans: [
        {
          resource: { attributes: [{ key: 'service.name', value: { stringValue: serviceName } }] },
          scopeSpans: [{ spans }],
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`collector ${res.status}: ${await res.text()}`);
}

/** Tempo 에 저장된 span 이름. trace 가 없으면 빈 배열이다. */
export async function storedSpanNames(traceId) {
  const res = await fetch(`${TEMPO}/api/traces/${traceId}`);
  if (res.status === 404) return [];
  const body = await res.json();
  return body.batches.flatMap((b) => b.scopeSpans.flatMap((s) => s.spans.map((x) => x.name))).sort();
}

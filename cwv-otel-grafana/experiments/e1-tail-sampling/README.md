# E1. tail sampling 이 페이지 trace 를 버리는 조건

collector 의 tail sampling 이 "판정 시점에 span 이 2개 미만이면 버린다"는 정책일 때, 브라우저가 지표 span 을 나눠 보내면 어떤 trace 가 살아남는지 본다.

## 실행

```bash
docker compose up -d            # cwv-otel-grafana 에서
cd experiments && node e1-tail-sampling/run.mjs
```

- collector-contrib 0.162.0(태그 `cwv-otel-grafana-v1`)과 0.163.1(main), Tempo 3.1.0
- 정책: `span_count.min_spans: 2`, `decision_wait: 15s`
- D, E 는 `num_traces: 5` 로 줄인 collector(`collector-small.yaml`)를 따로 띄워 쓴다. 판정 뒤 다른 trace 10개를 보내 앞의 trace 를 메모리에서 밀어낸 다음 늦은 span 을 보낸다.

## 결과 (2026-10-17, 0.162.0 과 0.163.1 에서 각각 두 번 실행해 같음)

| 경우 | 보낸 순서 | Tempo 에 남은 span |
|---|---|---|
| A | root 와 FCP 를 한 요청으로, 90초 뒤 LCP | page, fcp, lcp |
| B | root 먼저, 5초 뒤 FCP | page, fcp |
| C | root 만, 90초 뒤 LCP | 없음 |
| D | A 처럼 보낸 뒤 밀려나고, LCP 하나 | page, fcp (LCP 유실) |
| E | A 처럼 보낸 뒤 밀려나고, CLS 와 INP 를 한 요청으로 | page, fcp, cls, inp |

## 원리 (processor/tailsamplingprocessor, v0.162.0. 아래 위치는 v0.163.0 에서도 같다)

- `decision_cache` 의 기본 크기는 0 이고 no-op 캐시가 쓰인다(`config.go`).
- 판정이 끝난 trace 는 캐시가 없으면 `idToTrace` 에 판정 결과와 함께 남는다. 늦게 온 span 은 그 판정이 sampled 면 바로 내보내고, not sampled 면 버린다(`processor.go` 의 `processTrace` 끝부분).
- 메모리의 trace 수가 `num_traces`(기본 50000)에 닿으면 가장 오래된 trace 부터 지운다(`waitForSpace`).
- 지워진 뒤 도착한 span 은 처음 보는 trace 가 되어 다시 15초 판정을 받는다. span 이 하나면 버려지고 둘 이상이면 저장된다(D, E).

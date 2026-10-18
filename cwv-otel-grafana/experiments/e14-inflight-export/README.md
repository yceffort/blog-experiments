# E14. 주기 export 의 응답을 기다리는 동안 떠나면 CLS, INP 가 사라진다

visibilitychange 에서만 flush 해도, 떠나는 순간 10초 주기 metric export 가 응답을 기다리는 중이면 sdk-metrics 2.9.0 이상의 `forceFlush` 가 그 응답을 기다리는 사이 문서가 사라져 CLS, INP 가 Mimir 에 도착하지 않는지 본다. E7 의 "한계" 에 적어 둔 조건이다.

## 실행

```bash
docker compose up -d                                   # cwv-otel-grafana 에서
cd demo-web && VITE_COLLECTOR_URL=http://localhost:4319 npx vite --port 5174 --strictPort
cd experiments && node e14-inflight-export/run.mjs
```

- `proxy.mjs` 가 4319 에서 collector(4318) 앞에 선다. 요청을 그대로 넘기고 방문마다 첫 `/v1/metrics` 응답만 D ms 늦춘다. 브라우저 요청은 가로채지 않는다. Playwright 의 `route` 로 응답을 늦추는 방법은 핸들러 안에서 `unroute` 를 부르자 요청이 그대로 나가 지연이 걸리지 않았다. CORS 는 프록시가 처리한다(collector 는 5173 만 허용).
- 방문마다 페이지 로드 1초 뒤 버튼을 누르고, SDK 시작 10초 뒤의 첫 주기 export 가 프록시에 닿으면 그로부터 L ms 뒤에 `about:blank` 로 떠난다. 8초 뒤 Mimir 의 지표별 `_count` 증가분을 센다(`job="demo-web"`).
- Playwright 1.64.1 의 Chromium, OTel JS 2.12.0(exporter 0.223.0), web-vitals 6.2.3, collector contrib 0.163.1.

## 결과 (2026-10-18, 조건마다 두 번 실행해 같음)

| 응답 지연 D | 떠난 시각 L (export 뒤) | TTFB | FCP | LCP | INP   | CLS   | 떠날 때 나간 요청 |
| ----------- | ----------------------- | ---- | --- | --- | ----- | ----- | ----------------- |
| 2000ms      | 500ms                   | 1    | 1   | 1   | **0** | **0** | trace 만          |
| 2000ms      | 1500ms                  | 1    | 1   | 1   | **0** | **0** | trace 만          |
| 2000ms      | 2500ms                  | 1    | 1   | 1   | 1     | 1     | trace, metric     |
| 2000ms      | 3500ms                  | 1    | 1   | 1   | 1     | 1     | trace, metric     |
| 300ms       | 100ms                   | 1    | 1   | 1   | **0** | **0** | trace 만          |
| 0           | 100ms                   | 1    | 1   | 1   | 1     | 1     | trace, metric     |

- 떠나는 순간 주기 export 의 응답이 아직 오지 않았으면(L < D) CLS, INP 가 빠진다. 응답이 온 뒤면(L > D) 둘 다 도착한다. 경계는 떠나는 시각이 아니라 응답이 도착한 시각이다.
- 요청 크기: 5초 trace 배치 3,828B(page, ttfb, fcp, lcp), 주기 metric export 1,723~1,768B(ttfb, fcp, lcp), 떠날 때 trace 2,987B(inp, cls), 떠날 때 metric 1,327B(inp, cls). 떠날 때 두 요청을 합쳐 약 4.3KB 로, keepalive 한도 60KiB 의 7% 다.
- 떠날 때의 요청은 `about:blank` 로 이동을 시작한 뒤 10ms 안에 프록시에 닿았다.

## 원리

E7 과 같다. `forceFlush` 는 진행 중인 export 의 응답을 기다린 뒤에 collect 하므로, 응답 전에 문서가 사라지면 CLS, INP 는 어떤 요청에도 실리지 못한다. trace 의 `forceFlush` 는 기다리지 않아 같은 조건에서도 inp, cls span 은 나간다.

## 손실 규모

떠나는 시각이 10초 주기 안에 고르게 퍼져 있다면, 잃는 비율은 떠나는 순간 export 가 진행 중일 확률, 즉 응답 지연 d 를 주기 10초로 나눈 값이다. 응답이 50ms 면 0.5%, 2초면 20% 다.

## 한계

- 첫 주기 export 만 늦췄다. 두 번째 이후 주기도 같은 구조라 다르지 않을 것으로 본다.
- 응답 지연은 프록시가 만든 값이다. 실제 네트워크의 응답 지연 분포는 재지 않았다.

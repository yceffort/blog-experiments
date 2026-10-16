# E7. pagehide 에서도 메트릭을 flush 하면 CLS, INP 가 사라진다

"hidden 과 pagehide 에서 forceFlush 한다"는 흔한 권고를 OTel JS 2.12.0 메트릭에 적용하면, 떠날 때 보고되는 CLS 와 INP 가 Mimir 에 도착하지 않는지 본다.

## 실행

```bash
docker compose up -d && (cd demo-web && npm run dev)   # cwv-otel-grafana 에서
cd experiments && node e7-unload-flush/run.mjs
```

demo-web 에 `?pagehideFlush` 를 붙이면 pagehide 에서도 flush 한다. 방문마다 10초 주기 export 전에 떠나고, Mimir 의 지표별 `_count` 증가분을 센다.

## 결과 (2026-10-17, 모드별 두 번 실행해 같음)

| flush 시점 | TTFB | FCP | LCP | INP | CLS |
|---|---|---|---|---|---|
| visibilitychange 만 | 1 | 1 | 1 | 1 | 1 |
| pagehide 와 visibilitychange | 1 | 1 | 1 | 0 | 0 |

## 원리

1. 떠날 때 pagehide 가 먼저 온다(E3). 이때 forceFlush 가 TTFB, FCP, LCP 로 export 를 시작한다.
2. 이어서 visibilitychange 에서 web-vitals 가 CLS, INP 를 보고하고 다시 forceFlush 를 부른다.
3. sdk-metrics 2.9.0 부터 `PeriodicExportingMetricReader.onForceFlush` 는 진행 중인 export 가 끝날 때까지 기다린 뒤 다시 collect 한다(#6655). 첫 요청의 응답이 오기 전에 문서가 사라지므로 두 번째 collect 는 일어나지 않는다.

페이지를 살려 둔 채 pagehide 와 visibilitychange 를 다른 task 로 보내면, 두 번째 요청(inp, cls)은 첫 요청의 응답 직후에 나간다(두 번 실행: 응답 7346.7ms 뒤 7347.1ms, 7352.3ms 뒤 7352.9ms). sdk-metrics 1.30.1 의 `onForceFlush` 에는 이 대기가 없다.

trace 는 BatchSpanProcessor 의 forceFlush 가 기다리지 않아 같은 조건에서도 도착한다.

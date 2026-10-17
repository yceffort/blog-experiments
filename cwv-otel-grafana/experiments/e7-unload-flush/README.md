# E7. pagehide 에서도 메트릭을 flush 하면 CLS, INP 가 사라진다

"hidden 과 pagehide 에서 forceFlush 한다"는 흔한 권고를 OTel JS 2.12.0 메트릭에 적용하면, 떠날 때 보고되는 CLS 와 INP 가 Mimir 에 도착하지 않는지 본다.

## 실행

```bash
docker compose up -d && (cd demo-web && npm run dev)   # cwv-otel-grafana 에서
cd experiments && node e7-unload-flush/run.mjs
node e7-unload-flush/split-task.mjs   # 페이지를 살려 둔 채 두 flush 의 순서를 잰다
```

demo-web 에 `?pagehideFlush` 를 붙이면 pagehide 에서도 flush 한다. 페이지 로드마다 버튼을 한 번 누르고 1.5초 뒤, 10초 주기 export 전에 about:blank 로 떠난다. Mimir 의 지표별 `_count` 증가분과, tail sampling 의 decision_wait 를 지난 뒤 Tempo 에 도착한 span 을 센다.

- web-vitals 6.2.3 은 상호작용 항목의 처리를 idle 이나 1초 timeout 까지 미루므로(E13), 그 안에 떠나면 INP 가 보고되지 않는다. 클릭 1초 뒤에 떠나던 처음 버전은 그 경계 위에 있어서 1.5초로 늘렸다.
- about:blank 로 이동한 뒤 1.5초를 기다리고 컨텍스트를 닫는다. keepalive 요청은 문서가 사라져도 끝까지 가지만, 컨텍스트를 바로 닫으면 아직 나가지 못한 요청이 함께 버려진다. 바로 닫던 버전은 2회차부터 아무것도 도착하지 않는 실행이 있었다.

## 결과 (2026-10-18, 모드별 2번 실행해 같음)

Playwright 1.64.1 의 Chromium 156, collector-contrib 0.163.1, Mimir 3.2.2, Tempo 3.1.0.

| flush 시점 | TTFB | FCP | LCP | INP | CLS | Tempo 에 도착한 span |
|---|---|---|---|---|---|---|
| visibilitychange 만 | 1 | 1 | 1 | 1 | 1 | 5/5 |
| pagehide 와 visibilitychange | 1 | 1 | 1 | **0** | **0** | 5/5 |

2026-10-17 의 처음 실행(클릭 1초 뒤 이탈, 태그 `cwv-otel-grafana-v1`, collector-contrib 0.162.0)도 Mimir 열은 같았다.

## 원리

1. 떠날 때 pagehide 가 먼저 온다(E3). 이때 forceFlush 가 TTFB, FCP, LCP 로 export 를 시작한다.
2. 이어서 visibilitychange 에서 web-vitals 가 CLS, INP 를 보고하고 다시 forceFlush 를 부른다.
3. sdk-metrics 2.9.0 부터 `PeriodicExportingMetricReader.onForceFlush` 는 진행 중인 export 가 끝날 때까지 기다린 뒤 다시 collect 한다(#6655). 첫 요청의 응답이 오기 전에 문서가 사라지므로 두 번째 collect 는 일어나지 않는다.

trace 는 BatchSpanProcessor 의 forceFlush 가 진행 중인 export 를 기다리지 않아서, 위 표의 두 모드 모두 다섯 span 이 Tempo 에 도착했다. sdk-metrics 1.30.1 의 `onForceFlush` 에는 이 대기가 없다.

## 두 flush 의 순서 (`split-task.mjs`)

페이지를 살려 둔 채 pagehide 와 visibilitychange 를 50ms 간격의 다른 task 로 보내고, Playwright 의 route 로 첫 metric 요청의 응답을 2초 늦췄다. 요청 본문과 페이지의 resource timing 으로 잰 결과(2026-10-18, 2번 실행):

| 요청 | 실린 것 | 나간 시점 |
|---|---|---|
| pagehide 의 trace 요청 | page, fcp, ttfb, lcp | pagehide 뒤 6.1ms, 3.6ms |
| pagehide 의 metric 요청 | ttfb, fcp, lcp | pagehide 뒤 8.1ms, 5.6ms |
| visibilitychange 의 trace 요청 | inp, cls | visibilitychange 뒤 2.8ms, 2.8ms |
| visibilitychange 의 metric 요청 | inp, cls | 첫 metric 응답 뒤 2.0ms, 1.9ms |

## 한계

- visibilitychange 에서만 flush 해도, 떠나는 순간 진행 중인 metric export 가 있으면 같은 대기가 생긴다. 10초 주기 export 의 응답을 기다리는 동안 떠나는 경우다. 이 실험은 첫 주기 export 전에 떠나고 클릭으로 LCP 가 확정되어 quiet flush 도 없는 조건이라, 진행 중인 export 가 없을 때만 봤다. 그 조건에서의 유실률은 재지 않았다. 수집 코드는 quiet flush 에서 trace 만 내보내 이 경쟁이 생기는 경우를 하나 줄였다. gateway 로 가는 보고는 요청마다 따로 보내 앞 요청을 기다리지 않는다([E12](../e12-browser-lifecycle) 에서 앞 요청의 응답을 10초 늦춰도 떠날 때의 보고가 도착했다).
- 건수는 `job="demo-web"` 의 시리즈만 센다. 다른 실험의 시리즈는 빠지지만 `load.mjs` 처럼 demo-web 을 여는 부하를 같이 돌리면 그 방문도 섞이므로 따로 돌린다.

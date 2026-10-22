# E15. 첫 hidden 의 flush 응답을 기다리는 동안 떠나면 reader 에 따라 LCP, INP 가 사라진다

블로그 운영본이 쓰는 `FlushOnlyMetricReader`(주기 export 없이 forceFlush 때만 내보내고, 앞선 export 를 기다리지 않는 reader)가 `PeriodicExportingMetricReader` 와 어떻게 다른지 실제 Chromium 에서 비교한다. 탭을 숨겼다가(첫 hidden 의 flush) 돌아와 클릭한 뒤, 그 flush 의 응답이 오기 전에 떠나는 경우다. E14 는 10초 주기 export 와 겹치는 경우를 쟀고, 여기서는 수집 코드 자신이 부른 flush 와 겹치는 경우를 잰다.

## 실행

```bash
docker compose up -d                                   # cwv-otel-grafana 에서
cd demo-web && VITE_COLLECTOR_URL=http://localhost:4319 npx vite --port 5174 --strictPort
cd experiments && node e15-flush-only-reader/run.mjs
```

- E14 의 `proxy.mjs` 를 그대로 쓴다. 4319 에서 collector(4318) 앞에 서서 방문마다 첫 `/v1/metrics` 응답만 D ms 늦춘다.
- demo-web 은 `?reader=flush-only` 면 `FlushOnlyMetricReader` 를, 아니면 `PeriodicExportingMetricReader`(10초 주기)를 쓴다(`demo-web/src/telemetry/flush-reader.ts`, 블로그 `apps/blog/src/utils/telemetry/flush-reader.ts` 와 같다).
- 방문마다 로드 1초 뒤에 hidden 을 만들고(아래), 300ms 뒤 돌아와 버튼을 누르고, 1.5초 뒤 `about:blank` 로 떠난다. 8초 뒤 Mimir 의 지표별 `_count` 증가분을 센다(`job="demo-web"`).
- headless Chromium 은 탭을 바꿔도 hidden 이 되지 않아 `document.visibilityState` 를 덮어쓰고 `visibilitychange` 를 dispatch 한다(E12 와 같다). 돌아올 때는 덮어쓴 속성을 지워 원래 getter 로 되돌린다.
- Playwright 1.64.1 의 Chromium, OTel JS 2.12.0(exporter 0.223.0), web-vitals 6.2.3, collector contrib 0.163.1.

## 결과 (2026-10-22, 조건마다 두 번 실행해 같음)

| reader                        | 응답 지연 D | 첫 flush(로드 뒤) | 떠난 시각    | 떠날 때의 두 번째 요청        | LCP | INP   |
| ----------------------------- | ----------- | ----------------- | ------------ | ----------------------------- | --- | ----- |
| PeriodicExportingMetricReader | 5000ms      | 1040ms, 1045ms    | 3156ms       | 없음                          | 0   | **0** |
| PeriodicExportingMetricReader | 0           | 1037ms, 1038ms    | 3137, 3155ms | 떠난 뒤 10ms(cwv.lcp, cwv.inp) | 1   | 1     |
| FlushOnlyMetricReader         | 5000ms      | 1037ms, 1042ms    | 3136, 3158ms | 떠난 뒤 12ms(cwv.lcp, cwv.inp) | 1   | 1     |
| FlushOnlyMetricReader         | 0           | 1034ms, 1040ms    | 3137, 3157ms | 떠난 뒤 11ms, 13ms             | 1   | 1     |

- 첫 flush 에는 TTFB, FCP, CLS 가 실린다. TTFB, FCP, CLS 는 네 조건 모두 1건씩 도착했다.
- `PeriodicExportingMetricReader` 는 첫 flush 의 응답이 오지 않은 동안 떠나면 두 번째 요청이 나가지 않는다. 떠날 때 부른 `forceFlush` 가 `_awaitOngoingExport()` 에서 첫 flush 의 응답을 기다리는 사이 문서가 사라진다(E7, E14 와 같은 원리). 응답이 바로 오면(D = 0) 두 번째 요청이 떠난 뒤 10ms 에 나간다.
- `FlushOnlyMetricReader` 는 첫 flush 의 응답과 상관없이 떠난 뒤 약 12ms 에 두 번째 요청을 보낸다. delta 라서 두 요청에 같은 값이 겹치지 않는다(첫 요청 TTFB, FCP, CLS, 두 번째 요청 LCP, INP).

## 함정

- 스크립트로 만든 `visibilitychange` 는 `isTrusted` 가 false 다. web-vitals 6.2.3 의 `finalizeLCP`([`src/onLCP.ts`](https://github.com/GoogleChrome/web-vitals/blob/v6.2.3/src/onLCP.ts))는 `event.isTrusted` 를 확인하므로 가짜 hidden 으로는 LCP 를 확정하지 않는다. 그래서 LCP 는 첫 요청이 아니라 떠날 때의 두 번째 요청에 실린다. CLS 는 `isTrusted` 를 보지 않아 첫 hidden 에 보고된다. 실제 탭 전환에서는 LCP 도 첫 hidden 에 실린다.
- 돌아올 때 `visibilityState` 를 `'visible'` 을 돌려주는 getter 로 다시 덮어쓰면, 진짜로 떠날 때도 `visible` 로 읽혀 web-vitals 도 수집 코드도 hidden 을 보지 못한다. 그러면 reader 와 상관없이 두 번째 요청이 나가지 않고 LCP, INP 가 0 이 된다. 첫 실행에서 이렇게 쟀다가 네 조건이 모두 같게 나와 알아챘다. 덮어쓴 속성은 `delete` 로 지워야 한다.

## 한계

- 첫 hidden 의 flush 만 늦췄다. 수집 코드가 부르는 다른 flush(예: 잠정 LCP 의 trace flush)와 겹치는 경우는 같은 구조라 다르지 않을 것으로 본다.
- 응답 지연 5초는 차이를 보이려고 과장한 값이다. 실제 응답 지연에서 잃는 비율은 E14 의 계산(응답 지연을 flush 사이 간격으로 나눈 값)을 따른다.

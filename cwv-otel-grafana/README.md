# cwv-otel-grafana lab

브라우저의 Core Web Vitals 를 OpenTelemetry 로 trace(Tempo)와 metric(Mimir)에 나눠 보내고, Grafana 대시보드 두 개로 보는 재현 환경이다. 블로그 글에서 재현 환경이라고 밝힌 수치 중 E1~E7 은 태그 [`cwv-otel-grafana-v1`](https://github.com/yceffort/blog-experiments/tree/cwv-otel-grafana-v1/cwv-otel-grafana)(collector-contrib 0.162.0)에서, E8 부터는 main(collector-contrib 0.163.1)에서 쟀다. main 은 최신 버전으로 올리고, 버전이 바뀐 구성요소를 다루는 실험은 다시 돌려 각 README 에 적는다.

## 버전

2026-10-17 에 npm registry 와 Docker Hub 에서 확인한 최신 버전이다. E2 의 1.30.1, 0.57.2 와 E5 의 Tempo 2.10.8(2.x 의 마지막 버전)은 비교하려고 일부러 둔 옛 버전이다.

| 구성 | 버전 |
|---|---|
| web-vitals | 6.2.3 |
| OpenTelemetry JS | api 1.9.1, sdk 2.12.0, OTLP exporter 0.223.0 (E2 는 1.30.1, 0.57.2 도) |
| OpenTelemetry Collector contrib | 0.163.1 |
| Grafana Tempo | 3.1.0 (E5 는 2.10.8 도) |
| Grafana Mimir | 3.2.2 |
| Grafana | 13.2.4 |
| 브라우저 | Playwright 1.64.1 의 Chromium 156 |
| gateway | Node.js 24.20.0 (`node:24.20.0-alpine`) |

## 실행

```bash
docker compose up -d
cd demo-web && npm install && npm run dev      # http://localhost:5173
cd ../experiments && npm install && node load.mjs 300 4   # 페이지 로드 300번
```

Grafana 는 http://localhost:3000 이고 로그인 없이 열린다. 대시보드는 `CWV 운영 (Mimir)` 과 `CWV 원인 분석 (Tempo)` 두 개다. `CWV 운영` 의 `수집 경로` 변수로 gateway 가 모은 값(`cwv-gateway`)과 브라우저가 delta 로 보낸 대조군(`demo-web`)을 고른다. gateway 는 측정을 30분 동안 갱신이 없을 때 확정하므로 `cwv-gateway` 는 30분 늦게 보인다. 대시보드 JSON 은 `python3 grafana/build-dashboards.py` 로 다시 만든다. 포트는 모두 127.0.0.1 에만 열린다.

블로그의 실제 페이지에서 받는 운영본(TLS, CORS, Grafana 로그인, 보존 기간)은 블로그 저장소의 [`infra/otel`](https://github.com/yceffort/blog/tree/main/infra/otel) 에 있다. 버전은 이 lab 과 같지만 metric 경로는 다르다. lab 은 함정을 재현하려고 `delta_to_cumulative` 와 remote write 를 쓰고, 운영본은 [E8](experiments/e8-sparse-counts) 과 [E9](experiments/e9-client-clock) 의 결과대로 시각을 collector 가 받은 시각으로 바꿔 delta 를 Mimir 에 그대로 저장한다(E10 의 receive_time 경로). lab 의 gateway 경로([E11](experiments/e11-server-aggregation))는 운영본에 아직 없다.

## 흐름

```text
demo-web (web-vitals attribution)
  ├─ trace: 방문(처음 로드, bfcache 복원)당 trace 하나, span 길이 = 지표 값 ──▶ collector: tail_sampling(span 2개 이상) ──▶ Tempo
  ├─ metric(대조군): 지표별 delta 히스토그램(CWV 경계 버킷), 측정마다 첫 값 ──▶ collector: delta_to_cumulative ──▶ prometheus_remote_write ──▶ Mimir (job=demo-web)
  └─ 보고: 측정마다 revision 을 붙인 최신값 ──▶ gateway: 30분 동안 갱신이 없으면 확정, 누적 히스토그램(잠정값만 온 LCP 는 cwv.lcp.provisional) ──▶ collector ──▶ Mimir (job=cwv-gateway)
```

브라우저마다 delta 를 보내면 같은 시리즈의 writer 가 여럿이 되어 표본을 잃는다([E10](experiments/e10-concurrent-writers)). gateway 는 시리즈의 유일한 writer 라 같은 입력에서 잃지 않았다([E11](experiments/e11-server-aggregation)). 확정한 측정의 key 는 `gateway-data` volume 에 저장해 재시작한 뒤 같은 보고가 다시 와도 한 번만 센다. OTel metric 경로는 함정을 재현하는 대조군으로 남겨 둔다.

## 구성

| 경로 | 내용 |
|---|---|
| `compose.yaml`, `collector/`, `tempo/`, `mimir/`, `grafana/` | 수집 경로와 대시보드 |
| `gateway/` | 브라우저 보고를 측정마다 최신값으로 모아 확정하고 누적 히스토그램으로 collector 에 보내는 서버. `node --test gateway/*.test.mjs` |
| `demo-web/src/telemetry/` | 수집 코드. `page-trace.ts`(페이지 단위 trace), `lcp-gate.ts`(LCP 정식값과 quiet 잠정값), `vitals.ts`(id 중복 제거), `gateway.ts`(gateway 로 보고), `buckets.ts`, `labels.ts`, `attributes.ts`, `mask.ts`, `setup.ts` |
| `demo-web/test/` | 수집 규칙 단위 테스트. `npm test` |
| `experiments/` | 함정 재현 실험. 실험마다 README 에 목적, 명령, 결과가 있다 |

demo-web 은 쿼리 파라미터로 지표를 조절한다: `ttfb`(문서 응답 지연 ms), `lcp`(본문을 그리는 시점 ms), `img`(이미지 LCP, 이미지 응답 지연 ms), `shift`(배너를 끼우는 시점 ms), `slow`(클릭 처리 시간 ms).

## 실험

실험은 이름이 정해진 컨테이너를 띄운다. 같은 실험을 동시에 돌리면 뒤의 실행은 앞 실행의 컨테이너를 지우지 않고 멈추며, 각 실행은 끝날 때(오류, Ctrl+C 포함) 자기 컨테이너만 지운다(`experiments/lib/docker.mjs`).

| 실험 | 확인한 것 |
|---|---|
| [E1](experiments/e1-tail-sampling) | tail sampling 이 혼자 온 root 를 버리고, 메모리에서 밀려난 trace 의 늦은 span 하나를 버린다 |
| [E2](experiments/e2-exporter) | 0.57.2 의 sendBeacon 경로는 400 도 CORS 거부도 성공으로 보고한다. 0.223.0 은 fetch keepalive 로 실패를 보고한다 |
| [E3](experiments/e3-lifecycle) | 떠날 때 pagehide 가 visibilitychange 보다 먼저 오고, document 에 건 pagehide 리스너는 불리지 않는다 |
| [E4](experiments/e4-delta-expiry) | delta_to_cumulative 가 5분 넘게 조용한 시리즈를 지우면 `increase()` 가 덜 센다 |
| [E5](experiments/e5-tempo-metrics) | Tempo 2.x 의 TraceQL metrics 가 최근 30분만 보이는 설정, 분위수 근사 |
| [E7](experiments/e7-unload-flush) | pagehide 에서도 메트릭을 flush 하면 CLS, INP 가 사라진다 |
| [E8](experiments/e8-sparse-counts) | 방문이 드문 사이트에서는 delta_to_cumulative 와 `increase()` 가 페이지 로드를 거의 세지 못한다. delta 를 그대로 저장하고 `sum_over_time()` 으로 세면 정확하다. 단 같은 밀리초에 같은 시리즈의 값이 둘 오면 하나를 잃는다(E10) |
| [E9](experiments/e9-client-clock) | 시계가 늦은 브라우저의 delta 는 delta_to_cumulative 가 오류 없이 버린다. collector 가 받은 시각으로 바꾸면 남는다 |
| [E10](experiments/e10-concurrent-writers) | 여러 브라우저가 한 시리즈에 쓰면 시계가 모두 맞아도 도착 순서만으로 delta_to_cumulative 가 버리고(초당 10건에서 40% 안팎), 앞선 시계 하나는 그만큼 시리즈를 멈춘다. 손실은 `Aggregate` 의 두 규칙만으로 계산한 값과 거의 같다(14개 실행 중 2개가 1건 차이) |
| [E11](experiments/e11-server-aggregation) | gateway 가 시리즈의 유일한 writer 가 되면 E10 과 같은 입력, 동시 30건, 시계 오차, 재전송, 역순 revision, 재시작에서 확정한 표본을 잃지 않는다. 같은 입력의 delta 대조군은 61~97% 를 잃었다. 확정 전에 재시작하면 그 측정은 잃는다 |
| [E12](experiments/e12-browser-lifecycle) | Chromium 에서 늦게 그려진 LCP 는 정식 값으로, 탭 복귀 뒤의 CLS 갱신은 같은 측정의 새 revision 으로, bfcache 복원은 새 방문으로 보낸다. 탭 복귀는 visibilityState 를 흉내 낸 것이다 |

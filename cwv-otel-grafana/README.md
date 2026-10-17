# cwv-otel-grafana lab

브라우저의 Core Web Vitals 를 OpenTelemetry 로 trace(Tempo)와 metric(Mimir)에 나눠 보내고, Grafana 대시보드 두 개로 보는 재현 환경이다. 블로그 글에서 재현 환경이라고 밝힌 수치는 태그 [`cwv-otel-grafana-v1`](https://github.com/yceffort/blog-experiments/tree/cwv-otel-grafana-v1/cwv-otel-grafana)(collector-contrib 0.162.0)에서 쟀다. main 은 최신 버전으로 올리고, 버전이 바뀐 구성요소를 다루는 실험은 다시 돌려 각 README 에 적는다.

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

## 실행

```bash
docker compose up -d
cd demo-web && npm install && npm run dev      # http://localhost:5173
cd ../experiments && npm install && node load.mjs 300 4   # 페이지 로드 300번
```

Grafana 는 http://localhost:3000 이고 로그인 없이 열린다. 대시보드는 `CWV 운영 (Mimir)` 과 `CWV 원인 분석 (Tempo)` 두 개다. 대시보드 JSON 은 `python3 grafana/build-dashboards.py` 로 다시 만든다.

블로그의 실제 페이지에서 받는 운영본(TLS, CORS, Grafana 로그인, 보존 기간)은 블로그 저장소의 [`infra/otel`](https://github.com/yceffort/blog/tree/main/infra/otel) 에 있다. 수집 경로와 버전은 이 lab 과 같다.

## 흐름

```text
demo-web (web-vitals attribution)
  ├─ trace: 페이지 로드당 trace 하나, span 길이 = 지표 값 ──▶ collector: tail_sampling(span 2개 이상) ──▶ Tempo
  └─ metric: 지표별 delta 히스토그램(CWV 경계 버킷)      ──▶ collector: delta_to_cumulative ──▶ prometheus_remote_write ──▶ Mimir
```

## 구성

| 경로 | 내용 |
|---|---|
| `compose.yaml`, `collector/`, `tempo/`, `mimir/`, `grafana/` | 수집 경로와 대시보드 |
| `demo-web/src/telemetry/` | 수집 코드. `page-trace.ts`(페이지 단위 trace), `lcp-gate.ts`(quiet LCP 확정), `vitals.ts`(id 중복 제거), `buckets.ts`, `labels.ts`, `attributes.ts`, `mask.ts`, `setup.ts` |
| `demo-web/test/` | 수집 규칙 단위 테스트. `npm test` |
| `experiments/` | 함정 재현 실험. 실험마다 README 에 목적, 명령, 결과가 있다 |

demo-web 은 쿼리 파라미터로 지표를 조절한다: `ttfb`(문서 응답 지연 ms), `lcp`(본문을 그리는 시점 ms), `img`(이미지 LCP, 이미지 응답 지연 ms), `shift`(배너를 끼우는 시점 ms), `slow`(클릭 처리 시간 ms).

## 실험

| 실험 | 확인한 것 |
|---|---|
| [E1](experiments/e1-tail-sampling) | tail sampling 이 혼자 온 root 를 버리고, 메모리에서 밀려난 trace 의 늦은 span 하나를 버린다 |
| [E2](experiments/e2-exporter) | 0.57.2 의 sendBeacon 경로는 400 도 CORS 거부도 성공으로 보고한다. 0.223.0 은 fetch keepalive 로 실패를 보고한다 |
| [E3](experiments/e3-lifecycle) | 떠날 때 pagehide 가 visibilitychange 보다 먼저 오고, document 에 건 pagehide 리스너는 불리지 않는다 |
| [E4](experiments/e4-delta-expiry) | delta_to_cumulative 가 5분 넘게 조용한 시리즈를 지우면 `increase()` 가 덜 센다 |
| [E5](experiments/e5-tempo-metrics) | Tempo 2.x 의 TraceQL metrics 가 최근 30분만 보이는 설정, 분위수 근사 |
| [E7](experiments/e7-unload-flush) | pagehide 에서도 메트릭을 flush 하면 CLS, INP 가 사라진다 |

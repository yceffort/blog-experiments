# E5. TraceQL metrics 가 최근 구간만 보이는 설정과 분위수 근사

사내 환경에서 TraceQL metrics 는 조회 범위를 몇 시간으로 잡아도 최근 30~40분만 값이 나왔다. 같은 구간을 trace 검색하면 데이터가 있었다. Tempo 2.x 의 설정 차이로 이것이 재현되는지, 그리고 분위수가 얼마나 근사되는지 본다.

## 실행

```bash
docker compose up -d                                        # cwv-otel-grafana 에서(Tempo 3.1.0)
docker compose -f experiments/e5-tempo-metrics/compose.yaml up -d   # Tempo 2.10.8 세 대
cd experiments && node e5-tempo-metrics/send.mjs 65         # 65분 동안 10초마다 보낸다
node e5-tempo-metrics/query.mjs 60                          # 끝난 뒤 최근 60분을 조회한다
```

- 보내는 span: root(`e5.page`)와 자식(`e5.value`, INTERNAL kind). 자식의 길이는 100, 300, 1000, 2500, 4000ms 를 돌아가며 쓴다. 5분에 30개, 정확한 p75 는 2500ms 다.
- Tempo 3.1.0 은 lab 의 collector(tail sampling)를 거치고, 2.10.8 세 대는 각자의 OTLP/HTTP 로 바로 받는다.

| 인스턴스 | local-blocks 설정 |
|---|---|
| tempo2-default | 기본값(`filter_server_spans: true`, `flush_to_storage: false`) |
| tempo2-noflush | `filter_server_spans: false`, `flush_to_storage: false` |
| tempo2-flush | `filter_server_spans: false`, `flush_to_storage: true` |

## 결과 (2026-10-17, 두 번 조회해 같음)

16:00 과 16:23(UTC) 에 각각 최근 60분을 5분 구간으로 셌다. 아래는 16:23 조회(구간 15:20~16:20, 끝은 5분 배수로 맞춤)다. 5분 구간마다 보낸 span 은 30개다.

| 인스턴스 | 15:20~15:50 | 15:50~15:55 | 15:55~16:20 |
|---|---|---|---|
| tempo 3.1.0 | 30 씩 | 30 | 30 씩 |
| tempo2-default | 0 | 0 | 0 |
| tempo2-noflush | 0 | 11 | 30 씩 |
| tempo2-flush | 30 씩 | 30 | 30 씩 |

- noflush 는 조회 시각에서 30분 전(15:53)보다 오래된 구간이 0 이다. 15:50~15:55 구간의 11 은 15:53 이후 2분 남짓에 해당한다. 16:00 조회에서는 15:30 경계였다.
- default 는 자식 INTERNAL span 이 local-blocks 에 들어가지 않아 전부 0 이다.
- p75 는 모든 인스턴스에서 1.913s(정확한 값 2500ms). 표본이 적은 끝 구간은 1.519s, 2.147s.
- 측정값은 `query.mjs` 출력 그대로 남긴다(아래).

```text
tempo 3.1.0 | count | 0m:13 5m:30 10m:30 15m:30 20m:30 25m:30 30m:30 35m:30 40m:30 45m:30 50m:30 55m:30 60m:30
tempo 2.10.8 default | count | 0m:0 5m:0 10m:0 15m:0 20m:0 25m:0 30m:0 35m:0 40m:0 45m:0 50m:0 55m:0 60m:0
tempo 2.10.8 noflush | count | 0m:0 5m:0 10m:0 15m:0 20m:0 25m:0 30m:0 35m:11 40m:30 45m:30 50m:30 55m:30 60m:30
tempo 2.10.8 flush | count | 0m:13 5m:30 10m:30 15m:30 20m:30 25m:30 30m:30 35m:30 40m:30 45m:30 50m:30 55m:30 60m:30
```

`0m` 은 (15:15, 15:20] 구간이다. 송신은 15:17 에 시작했다.

## 소스에서 확인한 것

- 2.10.8 의 TraceQL metrics 기본값: `query_frontend.metrics.query_backend_after` 30m, `max_duration` 3h(`modules/frontend/config.go`). 3.0 에서 15m 로 바뀌었다(v3.0.0 릴리스 노트).
- 2.10.8 query-frontend 는 `cutoff = time.Now().Add(-QueryBackendAfter)` 로 구간을 나누고, cutoff 이전은 `ReplicationFactor == MetricsGeneratorReplicationFactor`(1) 인 블록만 찾는다. 그런 블록이 없으면 백엔드 조회를 하지 않는다(`modules/frontend/metrics_query_range_sharder.go`). ingester 블록은 `DefaultReplicationFactor`(0) 다(`tempodb/backend/block_meta.go`).
- 2.10.8 local-blocks 의 `filter_server_spans` 는 기본 true 이고, SERVER kind 이거나 부모가 없는 span 만 남긴다(`modules/generator/processor/localblocks/processor.go` 의 `filterBatches`).
- Tempo 문서(3.x 마이그레이션 가이드): TraceQL metrics 쿼리는 RF1 블록만 읽는다.
- 분위수(`pkg/traceql/engine_metrics.go` 의 `Log2Bucketize`, `Log2QuantileWithBucket`, v3.1.0): 값을 다음 2의 거듭제곱으로 올려 버킷에 넣고, 찾는 순번이 든 버킷과 바로 앞 버킷 사이를 지수 보간한다. 비어 있는 버킷은 목록에 없다.
- 숫자 속성 분위수(`pkg/traceql/ast_metrics.go` 의 `bucketizeAttribute`, v3.1.0): int 와 duration 만 받고 double 은 Nil 을 돌려준다. 2 미만 값은 뺀다. duration 도 2ns 미만은 뺀다(`bucketizeDuration`).

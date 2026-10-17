# E9. 브라우저 시계가 어긋나면 metric 이 오류 없이 버려진다

metric 데이터 포인트의 시각은 브라우저가 찍는다. 방문자의 시계는 몇 초에서 몇 분까지 어긋나 있을 수 있다. 같은 라벨 조합으로 들어온 값 중 시각이 앞선 값보다 이른 것이 생기면 수집 경로가 그 값을 어떻게 처리하는지 본다.

## 실행

```bash
docker compose up -d            # cwv-otel-grafana 에서
cd experiments && node e9-client-clock/run.mjs a   # 약 1분
```

- 브라우저 셋이 같은 라벨 조합으로 LCP 한 건씩을 3초 간격으로 보낸다. 시계는 첫째가 맞고, 둘째가 2분 늦고, 셋째가 30초 빠르다.
- collector-contrib 0.163.1, Mimir 3.2.2. 세 경로에 같은 값을 동시에 보낸다.

| 경로 | 처리 |
|---|---|
| lab | lab 의 collector(`delta_to_cumulative`, remote write) |
| client_time | delta 를 그대로 Mimir OTLP 엔드포인트로(`-distributor.otel-native-delta-ingestion`), 시각은 브라우저 것 그대로 |
| receive_time | client_time 과 같고, collector 의 `transform` 으로 시각을 받은 시각(`Now()`)으로 바꾼다(`collector-receive-time.yaml`) |

## 결과 (2026-10-17, 두 번 실행해 같음)

| 경로 | Mimir 에 남은 샘플 | 건수 |
|---|---|---|
| lab | 1, 2 (누적값) | 2 |
| client_time | 1, 1 | 2 |
| receive_time | 1, 1, 1 | 3 |

- lab 과 client_time 모두 2분 늦은 둘째 브라우저의 값을 버렸다. collector 로그에도 오류가 없었다.
- lab 에서 버린 것은 `delta_to_cumulative` 다. 같은 시리즈에 들어온 delta 의 시작 시각이 그 시리즈 상태의 시작 시각보다 이르면 `ErrOlderStart`, 시각이 마지막 시각 이하면 `ErrOutOfOrder` 로 버린다(`internal/delta/delta.go` 의 `Aggregate`, v0.163.0). 앞의 오류 메시지는 "여러 프로세스가 같은 시리즈를 보내는지 확인하라" 고 안내한다. 버린 건수는 로그가 아니라 collector 내부 메트릭 `otelcol_deltatocumulative_datapoints{error="delta.ErrOlderStart"}` 에만 남았다(두 번 실행 뒤 2).
- client_time 에서는 Mimir 가 순서가 뒤바뀐 샘플을 받지 않는다(`-ingester.out-of-order-time-window` 기본값 0).
- 받은 시각으로 바꾸면 순서가 collector 에 도착한 순서가 되어 셋 다 남는다. 대신 값의 시각이 페이지 로드 시각이 아니라 collector 가 받은 시각이 된다. demo-web 과 블로그는 10초마다, 그리고 페이지가 숨겨질 때 보내므로 차이는 대개 10초 안쪽일 것으로 본다(재지 않았다).

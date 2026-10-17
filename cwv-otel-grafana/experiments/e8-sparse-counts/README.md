# E8. 방문이 드문 사이트에서 Mimir 가 페이지 로드를 몇 건으로 세는가

블로그에 lab 구성을 그대로 올리자 Mimir 대시보드가 비었다. 라벨 조합마다 샘플이 하나씩만 쌓였기 때문이다. 방문이 드문 사이트를 흉내 내어, 같은 값을 네 가지 수집 경로로 보내고 대시보드 쿼리가 몇 건으로 세는지 본다.

## 실행

```bash
docker compose up -d            # cwv-otel-grafana 에서
cd experiments && node e8-sparse-counts/run.mjs a   # 약 16분
```

- LCP 1800ms 를 8번 보낸다. 라벨 조합(`visit`) 다섯 개(s1~s5)는 한 번씩, s6 은 7분 간격으로 세 번(0, 7, 14분). 7분은 `max_stale` 기본값 5분과 1분 검사 주기를 넘는다.
- collector-contrib 0.163.1, Mimir 3.2.2. 네 경로에 같은 값을 동시에 보낸다.

| 경로 | collector | Mimir | 대시보드 쿼리 |
|---|---|---|---|
| lab | lab 의 collector(`delta_to_cumulative` 기본값, remote write) | lab | `increase()` |
| long_stale | `max_stale: 168h`, remote write(`collector-long-stale.yaml`) | e8-mimir | `increase()` |
| otlp_zero | `max_stale: 168h`, OTLP 엔드포인트(`collector-otlp-zero.yaml`) | e8-mimir, `-distributor.otel-created-timestamp-zero-ingestion-enabled` | `increase()` |
| native_delta | `delta_to_cumulative` 없음, 받은 시각으로 바꿈, OTLP 엔드포인트(`collector-native-delta.yaml`) | e8-mimir-delta, `-distributor.otel-native-delta-ingestion` | `sum_over_time()` |

e8-mimir 와 e8-mimir-delta 는 이름 접미사가 lab 과 같도록 `-distributor.otel-metric-suffixes-enabled` 를 켰다.

## 결과 (2026-10-17, 세 번 실행)

| 경로 | Mimir 에 쓰인 값(s1~s5 / s6) | 8건을 센 값 | p75 |
|---|---|---|---|
| lab | 1 / 1, 1, 1 | 0.00 | 없음 |
| long_stale | 1 / 1, 2, 3 | 2.43 | 1875 |
| otlp_zero | 0, 1 / 0, 1, 2, 3 | 10.66 | 1875 |
| native_delta | 1 / 1, 1, 1 | 8.00 | 1875 |

- lab 은 두 번째(b)와 세 번째(c) 실행의 값이고 둘이 같다. 첫 실행(a)에서는 s6 의 첫 값이 2 였다(1.21, p75 1875). lab 의 Mimir 원본 표본을 보면 `run=a` 로 두 번 실행됐고(12:53, 13:11), 첫 실행의 마지막 s6 값(13:07:44)과 두 번째 실행의 첫 s6 값(13:11:52) 사이가 4분 8초라 계속 떠 있는 lab collector 가 누적 상태를 만료 전에 이어받았다. 값 [2, 1, 1] 에 `increase()` 를 적용하면 리셋 보정으로 1, 외삽으로 1.21 이 된다. 실행마다 새로 띄우는 나머지 세 경로는 영향이 없었고 세 번 모두 같았다. 지금의 `run.mjs` 는 인자 뒤에 실행 시각을 붙여 run 라벨을 실행마다 새로 만든다.
- lab: 시리즈마다 샘플이 하나라 `increase()` 가 계산할 짝이 없고, s6 은 공백마다 누적값이 지워져 1 로 돌아간다. 대시보드는 빈다.
- long_stale: s6 은 이어지지만 s1~s5 는 여전히 샘플 하나다.
- otlp_zero: 시작 시각의 0 샘플 덕분에 모든 시리즈가 증가로 잡히지만, `increase()` 가 구간 끝까지 외삽해 8건을 10.66 으로 센다. p75 가 그대로인 것은 값이 모두 1800ms 라 모든 시리즈가 같은 버킷에 있기 때문이다. 외삽 배율은 첫 샘플 시각과 조회 구간 경계에 따라 시리즈마다 다르므로, 값이 다른 시리즈를 합치면 비율과 분위수도 바뀐다. 이 lab 은 `rating` 이 라벨이라 good 과 poor 는 언제나 다른 시리즈다. 예를 들어 100초 구간에서 good 시리즈가 -90초 0, -89초 1 이고 poor 시리즈가 -90초 0, -40초 1 이면 `increase()` 가 1.5 와 1.8 을 돌려줘 good 비율이 50% 가 아니라 45.5% 가 된다(Prometheus 의 외삽 규칙으로 계산한 값이다).
- native_delta: 샘플 하나가 페이지 로드 하나의 값이라 구간 안의 샘플을 더하면 건수가 정확히 나온다. 단 같은 라벨 조합의 값이 같은 밀리초에 두 개 오지 않을 때만이다(아래 한계). 버킷도 같은 방식으로 더해 분위수를 낸다.
- p75 1875 는 (1500, 2000] 버킷 안의 선형 보간값이다. 실제 값은 1800 이다.

native_delta 의 한계:

- Mimir 의 delta 저장(`-distributor.otel-native-delta-ingestion`)은 실험 기능이다. Mimir 3.2.2 의 설명은 "Delta support is in an early stage of development. The ingestion and querying process is likely to change over time." 이다.
- 같은 라벨 조합의 값 두 개가 collector 에 같은 밀리초에 도착하면 같은 시각의 샘플이 되어 Mimir 가 `sample_duplicate_timestamp` 로 버린다. [E10](../e10-concurrent-writers) 에서 시리즈 하나에 초당 10건일 때 1.3~1.5%, 50건일 때 6.7~7.5% 를 잃었다.
- 시각을 받은 시각으로 바꾸는 이유는 [E9](../e9-client-clock) 에 있다.

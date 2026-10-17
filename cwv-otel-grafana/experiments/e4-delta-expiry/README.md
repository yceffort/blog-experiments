# E4. delta_to_cumulative 가 조용한 시리즈를 잊으면 increase() 가 덜 센다

브라우저는 delta 히스토그램을 보내고, collector 의 `delta_to_cumulative` 가 누적으로 바꿔 Mimir 에 쓴다. 이 프로세서는 `max_stale`(기본 5분) 동안 샘플이 없는 시리즈의 누적값을 지운다. 드문드문 오는 라벨 조합에서 이것이 건수를 어떻게 바꾸는지 본다.

## 실행

```bash
docker compose up -d            # cwv-otel-grafana 에서
cd experiments && node e4-delta-expiry/run.mjs a   # 약 23분
```

- collector-contrib 0.162.0(태그 `cwv-otel-grafana-v1`)과 0.163.1(main). 기본값 collector(lab 의 collector)와 `max_stale: 15m` collector(`collector-stale15m.yaml`)에 같은 delta 를 동시에 보낸다.
- 보내는 시각(분): 0, 1, 2, 4.5, 10.5, 16.5, 17, 22.5. 6분 공백 두 번, 5.5분 공백 한 번이 들어 있다.
- 실행마다 `run` 라벨을 달아 시리즈를 나눈다.

## 결과 (2026-10-17, 0.162.0 과 0.163.1 에서 각각 두 번 실행해 같음)

| 실행 | collector | Mimir 에 쓰인 누적값 | `increase()` | `resets()` |
|---|---|---|---|---|
| a | max_stale 5m | 1, 2, 3, 4, 1, 1, 2, 3 | 6.40 | 1 |
| a | max_stale 15m | 1, 2, 3, 4, 5, 6, 7, 8 | 7.47 | 0 |
| b | max_stale 5m | 1, 2, 3, 4, 1, 1, 2, 3 | 6.40 | 1 |
| b | max_stale 15m | 1, 2, 3, 4, 5, 6, 7, 8 | 7.47 | 0 |

표는 0.162.0 의 a, b 실행이다. 0.163.1 의 두 실행(a163, b163)도 값, `increase()`, `resets()` 가 모두 같았다.

- 6분 공백 뒤에는 두 번 모두 누적값이 지워져 1부터 다시 시작했다.
- Prometheus 가 리셋으로 알아챈 것은 4→1 한 번뿐이다. 1→1 은 값이 줄지 않아 증가 0 으로 센다.
- 5.5분 공백은 만료 검사(1분마다, `time.NewTicker(time.Minute)`)에 걸리지 않아 이어졌다. 실제 만료 시점은 마지막 샘플 뒤 5분에서 6분 사이다.
- 15분 collector 의 increase 가 8 이 아닌 것은 첫 샘플을 증가로 세지 못하고 외삽하기 때문이며 만료와 무관하다.

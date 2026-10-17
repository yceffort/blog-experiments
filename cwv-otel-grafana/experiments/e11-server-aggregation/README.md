# E11. gateway 가 시리즈의 유일한 writer 가 되면 표본이 남는가

[E10](../e10-concurrent-writers) 의 손실은 브라우저마다 같은 시리즈에 따로 쓰기 때문이다. lab 의 `gateway/` 는 브라우저 보고를 받아 측정마다 최신값 하나로 모으고, 갱신이 멈추면 확정해 시리즈별 누적 히스토그램에 더한 뒤 주기마다 collector 로 보낸다. 시리즈의 writer 는 gateway 하나뿐이고 시각도 gateway 가 정한다. 같은 보고를 lab 의 delta 경로(`delta_to_cumulative`, 대조군)에도 보내 같은 입력으로 비교한다.

## gateway 의 규칙

- 측정 key 는 문서, 방문, 지표 이름이다. revision 이 받은 것보다 크면 갱신하고, 같으면 `duplicate`, 작으면 `stale` 로 센 뒤 버린다.
- 마지막 갱신 뒤 `FINALIZE_MS`(lab 은 30분) 동안 새 보고가 없으면 확정한다. 히스토그램에 넣은 표본은 고칠 수 없으므로 확정한 뒤에 온 보고는 넣지 않고 `late` 로 센다.
- 처음 내보내는 시리즈는 값을 0 으로 한 번 내보낸다. `increase()` 는 시리즈의 첫 샘플을 기준점으로만 쓰므로 첫 샘플부터 값이 있으면 그 값을 세지 못한다([E8](../e8-sparse-counts)).
- 받는 라벨은 `page.route`, `navigation.type`, `rating`, `interaction.type`, `run`(실험용)뿐이다.

## 실행

```bash
docker compose up -d            # cwv-otel-grafana 에서
cd experiments && node e11-server-aggregation/run.mjs a   # 약 5분
```

- gateway 를 따로 띄운다(포트 34360, 확정 2초, 내보내기 2초, `service.name` 은 `lab-e11`). lab collector 를 거쳐 lab Mimir 에 쌓인다.
- jitter-50 과 skew2014-10 은 E10 과 같은 seed 의 입력이다. 값은 200~10000ms 에서 따로 뽑아 버킷을 섞었고, `rating` 라벨로 시리즈가 셋으로 나뉜다. gateway 는 브라우저 시각을 쓰지 않는다.
- 저장 건수는 Mimir 의 원본 샘플로 센다. 누적값이 줄면(재시작) 앞 구간의 마지막 값을 더한다. 외삽이 없는 값이다. 버킷도 같은 방식으로 세어 입력에서 계산한 기대값과 비교한다.
- `increase()` 는 대시보드가 쓰는 방식으로 10분 구간을 센 값이다.

## 결과 (2026-10-17, seed a 한 번)

| 경우 | 보낸 측정 | gateway 처리 | 저장(gateway) | 버킷 | `increase()` | 저장(delta 대조군) |
|---|---|---|---|---|---|---|
| burst: 같은 라벨 30개를 동시에 | 30 | accepted 30 | 30 | 일치 | 30.65 | 1 (96.7% 잃음) |
| jitter-50 (E10 입력) | 3056 | accepted 3056 | 3056 | 일치 | 3082.89 | 1199 (60.8% 잃음) |
| skew2014-10 (E10 입력) | 1219 | accepted 1219 | 1219 | 일치 | 1228.53 | 35 (97.1% 잃음) |
| revisions: rev1, rev2, rev2 재전송, rev1 역순, 확정 뒤 rev3 20건 | 200 | accepted 200, updated 200, duplicate 200, stale 200, late 20 | 200 | 일치 | 211.45 | |
| provisional: 잠정값만 25건, 잠정값 뒤 정식 값 25건 | 50 | accepted 50, updated 25, provisional 25 | 50 | 일치 | 58.91 | |
| sparse: 라벨 조합 6개에 8건(E8 의 모양) | 8 | accepted 8 | 8 | 일치 | 8.53 | |
| restart: 100건, 재시작, 100건, 확정 전 30건, 재시작 | 230 | | 200 | 일치 | 211.11 | |

- 같은 seed 의 E10 에서 receive_time 경로는 jitter-50 에서 7.5%, skew2014-10 에서 0.8% 를 잃었다. 대조군의 jitter-50 손실이 E10 의 lab 경로(75.4%)보다 작은 것은 `rating` 라벨로 시리즈가 셋으로 나뉘어 시리즈 하나의 초당 건수가 줄었기 때문으로 본다.
- revisions: 값이 줄어든 갱신 97건을 포함해 200개 측정 모두 마지막 revision 의 값으로 세었다. 재전송과 늦게 온 이전 revision 은 값을 바꾸지 않았고, 확정 뒤 갱신 20건은 `late` 로만 세었다.
- provisional: 잠정값만 온 25건은 그 값(800ms)으로 확정되어 `provisional` 로 세었고, 정식 값이 온 25건은 6000ms 로 세었다.
- restart: 확정해 내보낸 200건은 재시작을 넘어 남았다. 확정 전에 재시작한 30건은 잃었다. gateway 는 SIGTERM 을 받으면 확정해 둔 값을 한 번 더 내보내고 끝난다.
- `increase()` 는 정확한 건수보다 크게 센다. 마지막 샘플부터 조회 시각까지(내보내기 간격 이하)를 외삽하기 때문이라 오차는 대략 내보내기 간격을 시리즈 나이로 나눈 값이다. provisional 은 생긴 지 약 10초인 시리즈를 2초 간격으로 내보내 18% 를 넘게 셌다(원본 샘플은 0 다음 25 로 정확했다). lab 의 gateway 는 10초마다 내보내고 시리즈가 이어지므로 1시간 구간에서는 0.3% 안팎으로 계산된다(재지 않았다).

## 한계

- gateway 는 프로세스 하나다. 여러 개로 늘리면 같은 시리즈의 writer 가 다시 여럿이 된다. 측정 key 로 나눠 보내거나 인스턴스 라벨을 붙여야 하고, 재지 않았다.
- 확정 전 측정은 메모리에만 있어 재시작하면 잃는다(restart 의 30건).
- 확정 시간보다 늦게 온 CLS, INP 갱신은 반영되지 않는다(`late`). 30분은 대시보드에 늦게 보이는 시간과 늦은 갱신을 놓치는 비율 사이의 선택이다. 실제 탭에서 갱신이 얼마나 늦게 오는지는 재지 않았다.
- 브라우저는 보고 묶음마다 요청 하나를 보낸다. HTTP/1.1 에서 gateway 응답이 늦으면 origin 당 연결 6개가 차고 나머지 요청은 줄을 선다([E12](../e12-browser-lifecycle)).
- 운영본(블로그 저장소의 `infra/otel`)에는 아직 이 경로가 없다.

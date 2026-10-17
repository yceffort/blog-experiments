# E11. gateway 가 시리즈의 유일한 writer 가 되면 표본이 남는가

[E10](../e10-concurrent-writers) 의 손실은 브라우저마다 같은 시리즈에 따로 쓰기 때문이다. lab 의 `gateway/` 는 브라우저 보고를 받아 측정마다 최신값 하나로 모으고, 갱신이 멈추면 확정해 시리즈별 누적 히스토그램에 더한 뒤 주기마다 collector 로 보낸다. 시리즈의 writer 는 gateway 하나뿐이고 시각도 gateway 가 정한다. 같은 보고를 lab 의 delta 경로(`delta_to_cumulative`, 대조군)에도 보내 같은 입력으로 비교한다.

## gateway 의 규칙

- 측정 key 는 문서, 방문, 지표 이름이다. revision 이 받은 것보다 크면 갱신하고, 같으면 `duplicate`, 작으면 `stale` 로 센 뒤 버린다.
- 마지막 갱신 뒤 `FINALIZE_MS`(lab 은 30분) 동안 새 보고가 없으면 확정한다. 히스토그램에 넣은 표본은 고칠 수 없으므로 확정한 뒤에 온 보고는 넣지 않고 `late` 로 센다.
- 확정한 key 는 `STATE_FILE` 에 저장한다(lab 은 `gateway-data` volume). 처음 내보내는 시리즈는 0 만 싣기 때문에 그 시리즈에 더한 표본은 아직 collector 에 실리지 않았다. 이 표본도 함께 저장한다. 재시작하면 key 와 표본을 넘겨받아, 같은 보고가 다시 와도 `late` 로만 세고 실리지 않은 표본은 이어서 내보낸다. key 만 저장하던 구현은 SIGTERM 으로 끝낼 때 새 시리즈에 더한 표본의 key 를 저장하고 값은 0 으로만 보내서, 그 표본을 잃고 재전송도 `late` 로 버렸다.
- 잠정값(LCP quiet)만 오고 정식 값이 오지 않은 측정은 `cwv.lcp.provisional` 로 따로 센다. 기본 CWV 통계(`cwv.lcp`)에는 정식 값만 들어간다.
- 처음 내보내는 시리즈는 값을 0 으로 한 번 내보낸다. `increase()` 는 시리즈의 첫 샘플을 기준점으로만 쓰므로 첫 샘플부터 값이 있으면 그 값을 세지 못한다([E8](../e8-sparse-counts)).
- 받는 라벨은 `page.route`, `navigation.type`, `rating`, `interaction.type`, `run`(실험용)뿐이다.

## 실행

```bash
docker compose up -d            # cwv-otel-grafana 에서
cd experiments && node e11-server-aggregation/run.mjs a   # 약 5분
```

- gateway 를 따로 띄운다(127.0.0.1:34360, 확정 2초, 내보내기 2초, `service.name` 은 `lab-e11`, 확정 key 는 실행마다 새 임시 파일). lab collector 를 거쳐 lab Mimir 에 쌓인다. 34360 에 다른 gateway 가 떠 있으면 멈춘다.
- jitter-50 과 skew2014-10 은 E10 과 같은 seed 의 입력이다. 값은 200~10000ms 에서 따로 뽑아 버킷을 섞었고, `rating` 라벨로 시리즈가 셋으로 나뉜다. gateway 는 브라우저 시각을 쓰지 않는다.
- 저장 건수는 Mimir 의 원본 샘플로 센다. 누적값이 줄면(재시작) 앞 구간의 마지막 값을 더한다. 외삽이 없는 값이다. 버킷도 같은 방식으로 세어 입력에서 계산한 기대값과 비교한다.
- `increase()` 는 대시보드가 쓰는 방식으로 10분 구간을 센 값이다.

## 결과 (2026-10-17, seed a)

| 경우 | 보낸 측정 | gateway 처리 | 저장(gateway) | 버킷 | `increase()` | 저장(delta 대조군) |
|---|---|---|---|---|---|---|
| burst: 같은 라벨 30개를 동시에 | 30 | accepted 30 | 30 | 일치 | 45.71 | 1 (96.7% 잃음) |
| jitter-50 (E10 입력) | 3056 | accepted 3056 | 3056 | 일치 | 3079.23 | 1202 (60.7% 잃음) |
| skew2014-10 (E10 입력) | 1219 | accepted 1219 | 1219 | 일치 | 1227.78 | 35 (97.1% 잃음) |
| revisions: rev1, rev2, rev2 재전송, rev1 역순, 확정 뒤 rev3 20건 | 200 | accepted 200, updated 200, duplicate 200, stale 200, late 20 | 200 | 일치 | 210.55 | |
| provisional: 잠정값만 25건, 잠정값 뒤 정식 값 25건 | 50 | accepted 50, updated 25, provisional 25 | `cwv.lcp` 25, `cwv.lcp.provisional` 25 | 일치 | 29.29 | |
| sparse: 라벨 조합 6개에 8건(E8 의 모양) | 8 | accepted 8 | 8 | 일치 | 8.50 | |
| restart: 100건, 재시작, 그 100건 재전송, 100건, 확정 전 30건, 재시작 | 230 | 재전송 100건은 late 100, accepted 0 | 200 | 일치 | 211.11 | |

- 같은 seed 의 E10 에서 receive_time 경로는 jitter-50 에서 7.5%, skew2014-10 에서 0.8% 를 잃었다. 대조군의 jitter-50 손실이 E10 의 lab 경로(75.4%)보다 작은 것은 `rating` 라벨로 시리즈가 셋으로 나뉘어 시리즈 하나의 초당 건수가 줄었기 때문으로 본다.
- revisions: 값이 줄어든 갱신 97건을 포함해 200개 측정 모두 마지막 revision 의 값으로 세었다. 재전송과 늦게 온 이전 revision 은 값을 바꾸지 않았고, 확정 뒤 갱신 20건은 `late` 로만 세었다.
- provisional: 정식 값이 온 25건은 `cwv.lcp` 에 6000ms 로, 잠정값만 온 25건은 `cwv.lcp.provisional` 에 800ms 로 따로 세었다.
- restart: 확정해 내보낸 200건은 재시작을 넘어 남았다. 재시작 뒤 같은 key 와 revision 으로 다시 보낸 100건은 넘겨받은 확정 key 덕분에 다시 세지 않았다(저장한 key 가 없던 첫 구현에서는 한 번 더 셌다). 확정 전에 재시작한 30건은 잃었다. gateway 는 SIGTERM 을 받으면 확정해 둔 값을 한 번 더 내보내고 끝난다.
- 대조군 수치는 처음 실행(60.8%, 96.7%, 97.1%)과 거의 같았다.
- `increase()` 는 정확한 건수보다 크게 센다. 마지막 샘플부터 조회 시각까지(내보내기 간격 이하)를 외삽하기 때문이라 오차는 대략 내보내기 간격을 시리즈 나이로 나눈 값이다. 막 생긴 시리즈에서는 오차가 크고 조회 시점에 따라 달라진다. 같은 burst 를 처음 실행에서는 30.65, 두 번째에서는 45.71 로 셌고, 처음 실행의 provisional 은 50건을 58.91 로 셌다(원본 샘플은 0 다음 25 로 정확했다). lab 의 gateway 는 10초마다 내보내고 시리즈가 이어지므로 1시간 구간에서는 0.3% 안팎으로 계산된다(재지 않았다).

## 한계

- gateway 는 프로세스 하나다. 여러 개로 늘리면 같은 시리즈의 writer 가 다시 여럿이 된다. 측정 key 로 나눠 보내거나 인스턴스 라벨을 붙여야 하고, 재지 않았다.
- 확정 전 측정은 메모리에만 있어 재시작하면 잃는다(restart 의 30건). 확정한 key 는 `keepFinalizedMs`(24시간) 동안만 들고 있어, 그보다 늦게 온 재전송은 새 측정으로 센다.
- 확정 시간보다 늦게 온 CLS, INP 갱신은 반영되지 않는다(`late`). 30분은 대시보드에 늦게 보이는 시간과 늦은 갱신을 놓치는 비율 사이의 선택이다. 실제 탭에서 갱신이 얼마나 늦게 오는지는 재지 않았다.
- 브라우저는 보고 묶음마다 요청 하나를 보낸다. HTTP/1.1 에서 gateway 응답이 늦으면 origin 당 연결 6개가 차고 나머지 요청은 줄을 선다([E12](../e12-browser-lifecycle)).
- 운영본(블로그 저장소의 `infra/otel`)에는 아직 이 경로가 없다.

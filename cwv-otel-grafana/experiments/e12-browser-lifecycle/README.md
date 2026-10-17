# E12. 실제 브라우저에서 늦은 LCP, 탭 복귀, bfcache 복원

수집 코드의 경계 조건 셋을 Chromium 에서 확인한다. 판정은 브라우저가 보낸 요청 본문으로 한다. demo-web 을 5174 포트로 따로 띄워 collector 와 gateway 대신 이 스크립트의 수신 서버(34370, 34371)로 보내게 한다. 떠날 때 보낸 요청은 Playwright 의 request 이벤트에 잡히지 않아서다(collector 의 수신 지표로 보면 도착한다).

## 실행

```bash
docker compose up -d && (cd demo-web && npm run dev)   # cwv-otel-grafana 에서. 마지막 확인(#11)에만 필요하다
cd experiments && node e12-browser-lifecycle/run.mjs     # 약 1분
```

## 결과 (2026-10-17, Playwright 1.64.1 의 Chromium 156)

수정 전은 같은 검사를 커밋 `b751dac` 의 demo-web 에 돌린 값이다.

| 시나리오 | 본 것 | 수정 전 | 수정 후 |
|---|---|---|---|
| 늦은 LCP: `?lcp=5000`, 입력 없이 7초 | OTel histogram 의 LCP | 56ms(제목. quiet 가 확정하고 정식 값을 버렸다) | 5080ms(본문) |
| | trace | `cwv.lcp` 56ms | `cwv.lcp.quiet` 72ms, `cwv.lcp` 5080ms |
| | gateway | 경로 없음 | rev1 잠정 72ms, rev2 5080ms. 잠정값의 응답을 10초 늦춰 응답 전에 떠났는데도 정식 값이 도착했다 |
| 탭 복귀: 숨김, 보임, 위쪽에 요소 삽입, 숨김 | gateway | 경로 없음 | 같은 key 로 rev1 0.0000, rev2 0.1124 |
| | OTel histogram 의 CLS | count 1, 0.0000 | count 1, 0.0000(대조군이라 첫 값만 센다) |
| bfcache: home, product, 뒤로, 앞으로, 뒤로 | trace root | 2개(문서마다 하나) | 5개(방문마다 하나), 모든 span 이 자기 방문의 root 에 붙음 |
| | LCP | 문서마다 하나. 복원 세 번의 LCP 를 버렸다 | 방문마다 하나(trace 5개, gateway 측정 5개) |
| loopback 포트(#11): lab 의 dev server 로 한 번 방문 | collector 와 gateway 의 수신 증가 | | span 5, metric point 4, 보고 4 |

## 브라우저 조건

- Playwright 의 Chromium 에서는 탭을 바꾸거나 창을 최소화해도 `visibilityState` 가 `visible` 로 남았다. 기본 headless shell, new headless, headful 에서, Playwright 의 backgrounding 인자를 빼거나 focus emulation 을 꺼도 같았다. 그래서 탭 복귀는 `visibilityState` 를 덮어쓰고 `visibilitychange` 를 보내 흉내 냈다. web-vitals 의 hidden 처리는 `isTrusted` 를 보지 않으므로 web-vitals 와 수집 코드는 실제와 같은 경로를 탄다. 실제 탭 전환은 확인하지 못했다.
- bfcache 복원은 new headless(`channel: 'chromium'`)에서 Playwright 가 기본으로 넣는 `--disable-back-forward-cache` 를 뺐을 때만 일어났다. 기본 headless shell 에서는 일어나지 않았다. 복원에는 `load` 가 다시 오지 않으므로 뒤로, 앞으로 가기는 commit 까지만 기다린다.
- gateway 응답을 10초 늦춘 채 bfcache 시나리오를 돌리면 보고 요청 20개 중 6개만 도착했다(늦추지 않으면 20개 모두). HTTP/1.1 에서 origin 당 연결 6개가 응답을 기다리느라 차고, 나머지는 줄을 섰다가 브라우저를 닫을 때 사라졌다. 처음에는 collector 와 gateway 를 한 포트로 받아 trace 요청까지 막혔으므로, 실제 구성처럼 포트를 나눴다. HTTP/2 로 받는 구성에서는 다를 수 있다(확인하지 않았다).

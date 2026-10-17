# E13. web-vitals 가 보고하지 않는 방문

web-vitals 의 콜백이 언제 불리고 언제 불리지 않는지, 블로그 시리즈 1편에서 소스로 따라간 규칙을 Chromium 에서 확인한다.

- `run.mjs`: 상호작용 직후 떠난 방문의 INP(web-vitals #805). 6.2.3, 수정이 들어간 main `e773747`(2026-10-16), Next.js 16.3.5 가 번들하는 4.2.1 을 같은 페이지에 올린다.
- `idle-after-input.mjs`: 클릭 전후 여러 시점에 건 `requestIdleCallback` 이 얼마 만에 불리는지.
- `idle-until-input.mjs`: 클릭 뒤 다른 입력이 없으면 idle 이 언제 오는지.
- `reports.mjs`: load 전에 떠난 방문의 TTFB, bfcache 로 돌아온 방문의 TTFB, FCP, LCP, INP.
- `idle-os-input.mjs`, `inp-os-input.mjs`: 위 스크립트의 클릭은 CDP 입력이다. 같은 것을 DevTools 를 붙이지 않은 Chrome Beta 에 macOS 마우스 이벤트로 클릭해 다시 잰다. 클릭은 `os-click.swift` 가 HID 이벤트 탭에 넣으며, 누르기 전에 그 좌표의 맨 위 창이 띄운 브라우저의 것인지 확인한다. 실행하는 터미널에 손쉬운 사용 권한이 있어야 하고, 도는 동안 커서가 움직인다.

떠나는 문서의 기록은 `sendBeacon` 으로 스크립트의 수신 서버에 보낸다. sessionStorage 로 다음 문서에 넘기는 방식은 탭을 닫는 경우를 볼 수 없어서다.

## 실행

```bash
cd experiments && npm install
node e13-report-timing/run.mjs                # 약 10분. REPEAT, VERSIONS, LOADS, CASES, RAC=1 로 범위를 바꾼다
node e13-report-timing/idle-after-input.mjs   # BIN=<브라우저 실행 파일> 이면 Playwright 없이 띄워 CDP 로 붙는다
node e13-report-timing/idle-until-input.mjs
node e13-report-timing/reports.mjs
# macOS 전용
cd e13-report-timing && swiftc -O os-click.swift -o os-click
node idle-os-input.mjs                        # WAKE=3000 이면 클릭 3초 뒤 마우스를 한 번 움직인다
node inp-os-input.mjs
```

web-vitals 는 `vendor/` 의 IIFE 번들을 쓴다. 다시 만들려면 `bash vendor/build.sh`. 소스에서 빌드한 6.2.3, 4.2.1 은 npm 배포본과 바이트 단위로 같았다.

## 결과 (2026-10-17, Playwright 1.64.1 의 Chromium 156 new headless)

아래 마지막 절을 빼면 클릭과 마우스 이동은 모두 Chrome DevTools Protocol 로 보낸 입력이다.

### 상호작용 직후 떠난 방문의 INP (`run.mjs`)

클릭 핸들러는 200ms 동안 메인 스레드를 잡는다. busy 는 클릭 뒤 3초 동안 45ms 작업을 MessageChannel 로 쉬지 않고 이어 붙인다. 떠난 시점은 클릭 핸들러가 끝난 뒤부터 잰다. 조건마다 5번씩 두 차례 돌린 합계(INP 보고된 방문 / 방문).

| 떠나는 방법 | 떠난 시점 | 6.2.3 idle | 6.2.3 busy | e773747 idle | e773747 busy |
|---|---|---|---|---|---|
| 클릭 핸들러가 `location.href` 변경 | 0.1초 | 1/10 | 0/10 | 10/10 | 10/10 |
| | 0.3초 | 0/10 | 0/10 | 10/10 | 10/10 |
| | 0.6초 | 1/10 | 0/10 | 10/10 | 10/10 |
| | 1.5초 | 10/10 | 10/10 | 10/10 | 10/10 |
| 링크, 응답 0.3초 | 0.3초 | 0/10 | 0/10 | 10/10 | 10/10 |
| 링크, 응답 1.5초 | 1.5초 | 10/10 | 10/10 | 10/10 | 10/10 |
| 링크, 응답 즉시 | 약 5ms | 0/10 | 0/10 | 0/10 | 0/10 |
| 탭 닫기 | 0.3초 | 0/10 | 0/10 | 10/10 | 10/10 |
| | 1.5초 | 10/10 | 10/10 | 10/10 | 10/10 |

- 보고된 INP 는 모두 200~208ms.
- 6.2.3 의 경계(5번씩 한 차례): 0.9초는 idle 3/5, busy 0/5, 1.1초는 둘 다 5/5. idle 콜백의 1초 timeout 근처에서 갈린다.
- 6.2.3 idle 에서 timeout 전에 보고된 방문 중 하나는 같은 페이지의 관찰자가 건 idle 콜백이 pagehide 1ms 전에 불렸다. 나머지는 원인을 확인하지 못했다.
- 응답 즉시 링크: 숨겨지는 순간 별도 관찰자로 `takeRecords()` 를 해도 클릭 항목이 없었다(6/6). 문서가 사라지기 전에 항목이 만들어지지 않았다.
- 4.2.1(5번씩 한 차례): 0.3초 idle 1/5, busy 0/5, 1.5초와 4.5초는 idle, busy 모두 0/5. timeout 이 없어 이 환경에서는 다음 입력 전까지 처리하지 않는다.
- 6.2.3 에서 INP 만 `reportAllChanges: true`(`RAC=1`): 0.3초에 이동, 링크, 탭 닫기로 떠난 방문 idle, busy 모두 30/30 보고.
- 모든 방문에서 hidden 시점에 별도 관찰자의 `takeRecords()` 는 비어 있었다. 클릭 항목은 이미 관찰자 콜백으로 전달된 뒤였다.

### idle 이 오는 시점 (`idle-after-input.mjs`, `idle-until-input.mjs`)

| idle 콜백을 건 시점 | 불리기까지 |
|---|---|
| 첫 클릭 전, 입력 없이 | 0~1ms |
| 클릭 핸들러 안 | 3~16ms |
| 클릭의 Event Timing 항목을 받은 관찰자 콜백(timeout 3초) | 19/19 timeout |
| 클릭 1초 뒤, 그 뒤로 입력 없음(timeout 15초) | timeout |
| 클릭 1초 뒤, 6초 뒤 마우스 이동 | 마우스 이동 직후 |

위 세 줄은 Playwright 로 띄운 Chromium 156(headless, headed)과 Playwright 기본 플래그 없이 직접 띄워 CDP 로 붙은 Chrome Beta 157.0.8103.6(headless, headed) 모두 같았다. 아래 두 줄은 Chromium 156 headless, headed 에서 쟀다.

처음에 클릭을 1.3초 간격으로 반복하며 쟀을 때는 idle 이 약 1.28초 뒤에 오는 것처럼 보였다. 다음 클릭 시각이었다. 간격을 3.5초로 늘리자 그만큼 늦어졌고, 입력을 아예 주지 않으면 timeout 까지 오지 않았다.

### load 전에 떠난 방문과 bfcache 복원 (`reports.mjs`, web-vitals 6.2.3)

이미지 하나 때문에 load 가 3초 뒤에 오는 페이지:

| 떠난 시점 | TTFB | FCP | LCP | CLS |
|---|---|---|---|---|
| 1초 | 0/5 | 5/5 | 5/5 | 5/5 |
| 5초 | 5/5 | 5/5 | 5/5 | 5/5 |

1초에 떠난 방문도 pagehide 때 `responseStart` 는 1~3ms 였다.

bfcache: 처음 로드에서 클릭하고 떠났다가, 뒤로 가기로 복원된 페이지에서 다시 클릭하고 떠난다. new headless 에서 Playwright 의 `--disable-back-forward-cache` 를 뺐다(E12). 15번 모두 복원됐다.

| 클릭 핸들러 | 처음 INP | 복원 뒤 INP | 복원 뒤 FCP, LCP | 복원 뒤 TTFB |
|---|---|---|---|---|
| 0ms | 16 | 8 | 17.3~37.8 | 0 |
| 20ms | 24 | 8 | 15.6~39.3 | 0 |
| 60ms | 64 | 64 | 19.2~37.3 | 0 |

복원 뒤의 INP 8 은 `InteractionManager` 의 대체값이다(상호작용 수는 있는데 `durationThreshold` 40 이상인 후보가 없을 때). 복원 뒤 FCP 와 LCP 는 같은 방문에서 0.3ms 안쪽으로 붙어 있다. 둘 다 pageshow 에서 requestAnimationFrame 두 번을 기다린 시간이다.

### OS 마우스 이벤트로 클릭했을 때 (`idle-os-input.mjs`, `inp-os-input.mjs`)

Chrome Beta 157.0.8103.6 을 창을 띄워 직접 실행하고(DevTools 연결 없음, 새 프로필), macOS HID 이벤트 탭에 마우스 이벤트를 넣었다. 페이지가 받은 클릭은 모두 `isTrusted: true`, `document.hasFocus()` 가 true 였다.

| 조건 | 결과 |
|---|---|
| 클릭의 Event Timing 항목을 받은 관찰자 콜백에서 건 idle 콜백(timeout 10초), 클릭 뒤 입력 없음 | 5/5 timeout, 그 사이 페이지에 들어온 입력 없음 |
| 같은 조건, 클릭 3초 뒤 마우스 이동 | pointermove 가 들어온 2번은 그 직후(+3036ms, +3046ms) 불림. 나머지 1번은 이동이 pointermove 로 들어오지 않았고 timeout |
| 6.2.3, 클릭 핸들러가 0.3초 뒤 `location.href` 변경 | INP 0/5 |
| 6.2.3, 1.5초 뒤 | INP 5/5 |
| e773747, 0.3초 뒤 | INP 5/5 |

- 클릭 핸들러는 200ms 동안 메인 스레드를 잡고, 클릭 뒤에는 입력을 넣지 않았다. 한가한 페이지만 쟀다.
- 보고된 INP 는 224~232ms 로 headless 보다 컸다. 창을 띄운 브라우저라 다음 화면이 그려지기까지의 시간이 더해진 것으로 보인다.
- CDP 입력과 같은 결과다. 클릭 뒤 idle 이 오지 않는 것은 CDP 입력 때문이 아니었다. 다만 Chromium 스케줄러의 어느 코드가 이렇게 만드는지는 확인하지 않았다.

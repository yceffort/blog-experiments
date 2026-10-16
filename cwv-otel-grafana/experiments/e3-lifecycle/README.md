# E3. 문서를 떠날 때 오는 이벤트와 순서

페이지를 떠날 때 `pagehide`, `visibilitychange` 가 어떤 순서로, 어느 대상에 걸린 리스너에 오는지 본다. OTel JS 의 BatchSpanProcessor 는 두 이벤트를 모두 `document` 에 건다.

## 실행

```bash
cd experiments && node e3-lifecycle/run.mjs
```

떠나는 문서의 console 은 읽을 수 없어서 sessionStorage 에 기록하고, 같은 origin 의 다음 문서에서 읽는다. Playwright 1.64.1 의 Chromium 156.

## 결과 (2026-10-17, 두 번 실행해 같음)

같은 탭에서 링크로 이동할 때:

```text
window.capture.beforeunload:visible
window.beforeunload:visible
window.capture.pagehide:visible
window.pagehide:visible
window.capture.visibilitychange:hidden
document.visibilitychange:hidden
window.visibilitychange:hidden
window.capture.unload:hidden
window.unload:hidden
```

- `pagehide` 가 `visibilitychange` 보다 먼저 온다. pagehide 때는 아직 visible 이다.
- `document.addEventListener('pagehide', ...)` 는 불리지 않는다. pagehide 는 Window 에서 발생하고 document 를 거치지 않는다.
- `@opentelemetry/sdk-trace` 2.12.0 의 브라우저 BatchSpanProcessor 도 pagehide 리스너를 document 에 건다(`platform/browser/export/BatchSpanProcessor.js`). 이 대비책은 Chromium 에서는 동작하지 않는다.

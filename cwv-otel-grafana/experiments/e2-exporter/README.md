# E2. 브라우저 OTLP exporter 는 전송 실패를 알려 주는가

OTel JS 1.x 와 2.x 의 브라우저 trace exporter 가 collector 의 400 응답과 CORS 거부를 어떻게 보고하는지 본다.

## 실행

```bash
cd experiments && node e2-exporter/run.mjs
```

- `entry.js` 를 esbuild 로 번들해 한 페이지에 두 버전을 올린다(npm 별칭 `otel1-*`, `otel2-*`).
- 페이지는 `localhost:4400`, 가짜 collector 는 `localhost:4401`(다른 origin). 경로로 응답을 고른다: `/ok` 200, `/bad` 400, `/nocors` CORS 헤더 없음.
- Playwright 1.64.1 의 Chromium 156

## 결과 (2026-10-17, 두 번 실행해 같음)

| exporter | 200 | 400 | CORS 거부 |
|---|---|---|---|
| 0.57.2, headers 없음 (sendBeacon) | success, 서버 1건 | **success**, 서버 1건 | **success**, 서버 0건 |
| 0.57.2, `headers: {}` (XHR) | success | failed | failed |
| 0.223.0 (fetch keepalive) | success | failed(400) | 네트워크 오류로 5번 시도 후 failed, 약 8초 |

sendBeacon 은 브라우저 큐에 넣었는지만 돌려준다. 0.57.2 는 그 값을 성공으로 보고한다.

## 바뀐 버전 (experimental/CHANGELOG.md, v2.12.0 태그)

- 0.204.0: headers 가 있으면 XHR 보다 fetch 를 먼저 쓴다(#5807)
- 0.211.0: XHR 전송 제거(#6317)
- 0.213.0: sendBeacon 대신 keepalive fetch(#6391)

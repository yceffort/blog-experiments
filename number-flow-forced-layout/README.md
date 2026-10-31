# number-flow 갱신 경로의 강제 동기 레이아웃 측정

[number-flow 갱신 경로의 강제 동기 레이아웃 줄이기](https://yceffort.kr/2026/10/number-flow-forced-layout)의 재현 코드와 결과다. [이슈 #17](https://github.com/yceffort/number-flow/issues/17)의 일부 부하 조건을 별도 페이지에서 재현해 [PR #18](https://github.com/yceffort/number-flow/pull/18), [PR #19](https://github.com/yceffort/number-flow/pull/19)의 변경을 비교한다. 회사 서비스의 원본 페이지와 원본 트레이스는 포함하지 않는다.

## 조건

| 빌드     | 커밋                                       | 내용                                |
| -------- | ------------------------------------------ | ----------------------------------- |
| `v0.2.0` | `3438c3eed55c65a07d99b634ca2c0fe75becf470` | 변경 전                             |
| `pr18`   | `90a753968c78299d9095c78c95a5117df3b8b1c9` | 읽기와 쓰기 단계 분리               |
| `v0.2.1` | `477893f382cff2562df1c8522c6f1aa6a63e3f87` | `prepare()`와 `animationsOf()` 추가 |

세 커밋의 `packages/number-flow/src`를 esbuild 0.28.2로 번들한다(`iife`, `es2019`, 최소화). React나 프레임워크 없이 `<number-flow>` 하나를 사용한다.

- `inputs.mjs`가 시드 `0x20261101`(539365633)로 입력을 생성한다. 숫자와 배경 텍스트는 독립된 난수열을 사용하며 모든 빌드와 반복 실행에 같은 입력을 전달한다. 로케일은 `en-US`다.
- 접두부(부호)와 접미부(%)가 있는 숫자를 1초마다 총 10회 갱신한다. 초기 값은 9자리이며, `same`은 계속 9자리, `vary`는 첫 갱신부터 7자리와 9자리를 번갈아 사용한다.
- 배경 텍스트 노드 24개를 11ms마다 2개씩 바꾼다. 입력 순서는 고정되지만 브라우저 스케줄링에 따라 실행 횟수와 시점은 달라질 수 있다. 실제 횟수는 각 결과의 `counts.noise`에 남긴다.
- Playwright 1.62.1의 Chromium 151을 헤드리스로 실행한다. 390x844 뷰포트, 배율 3, CDP CPU 4배 감속을 적용한다.
- 초기 렌더 후 1초 기다린 뒤 트레이스를 시작한다. 10회 갱신을 마친 뒤 종료하며 최초 애니메이션 갱신도 평균에 포함한다.
- 빌드 순서는 A/B/C, B/C/A, C/A/B로 순환한다(A=v0.2.0, B=pr18, C=v0.2.1). 시나리오마다 빌드별 3회, 전체 18회 실행한다.
- `nf-update` 마크가 들어 있는 `RunTask`를 갱신 태스크로 식별한다. 태스크 안의 `FunctionCall`에 중첩된 `UpdateLayoutTree`와 `Layout`을 각각 집계한다. `FunctionCall` 시간에는 하위 스타일과 레이아웃 시간이 포함되므로 순수 JavaScript 실행 시간이 아니다.
- 트레이스 종료 1.5초 뒤 `--current`와 `inert`로 복원한 DOM 문자열을 `Intl.NumberFormat`과 비교한다. 실행당 1회, 전체 18회 검사다. 중간 갱신이나 화면의 픽셀, 겹침, 이동 경로는 검사하지 않는다.

2026-11-01(KST) Apple M5 macOS에서 글 검토를 수행한 에이전트가 실행했다. UTC 측정 시각과 실행 환경은 결과 JSON에 기록돼 있다. 실제 저사양 기기나 회사 서비스에서의 v0.2.1 성능 측정은 아니다.

## 실행

```sh
cd number-flow-forced-layout
node measure.mjs same
node measure.mjs vary
```

Node.js, git, npm이 필요하다. 처음 실행하면 포크를 `work/`에 받고 esbuild, esm-env, playwright를 `work/deps/`에 설치한다. 트레이스 파일은 `work/traces/`, 요약과 고정 입력은 `results/`에 쓴다. 실행하면 같은 이름의 결과를 덮어쓰므로 원본을 보존하려면 복사본에서 실행한다.

## 결과와 해석

- [같은 자릿수 결과](results/same.md), [결과 JSON](results/same.json), [입력 JSON](results/inputs-same.json)
- [자릿수 변동 결과](results/vary.md), [결과 JSON](results/vary.json), [입력 JSON](results/inputs-vary.json)

각 결과에는 평균뿐 아니라 실행별 태스크 시간과 페이지 전체 스타일/레이아웃 시간이 있다. 입력 JSON의 마지막 줄바꿈을 제외한 UTF-8 바이트의 SHA-256을 결과에 기록하고, 실제 적용된 숫자 시퀀스와 갱신 태스크 10회가 일치하는지도 검사한다.

갱신 태스크 안의 강제 계산 감소와 페이지 전체 렌더링 비용 감소를 구분해야 한다. JavaScript 바깥에서 실행된 스타일/레이아웃까지 포함한 총량은 태스크 내부 시간과 다른 지표다. 세 번의 실행만으로 작은 총량 차이나 회귀를 확정하지 않는다.

글에 첨부한 ZIP에는 실행 코드, 입력과 결과, 트레이스 파일 18개, 아래 순서 재생 데이터가 포함된다. `SHA256SUMS`는 각 파일의 체크섬이다. 트레이스는 이 공개 재현 페이지에서만 수집했다.

## 갱신 한 번의 읽기와 쓰기 순서 (`order-log/`)

글의 "갱신 순서" 예제에 들어간 데이터다. `oplog.test.ts`는 포크의 `packages/number-flow/test/lite.test.ts`와 같은 jsdom 환경에서 값 하나를 바꾸는 동안의 레이아웃 읽기(`getBoundingClientRect`, `getComputedStyle`, `offset*`)와 DOM 쓰기(`MutationObserver.takeRecords()`)를 순서대로 기록한다. 포크의 `packages/number-flow/test/`에 복사해 두고 다음처럼 실행했다.

```sh
OPLOG_OUT=oplog-v0.2.1.json OPLOG_VERSION=v0.2.1 npx vitest run test/oplog.test.ts --project browser
```

`v0.2.0`은 그 커밋의 `src`에 같은 테스트 파일을 얹어 실행했다. `build-order-data.mjs`가 두 기록을 합쳐 `layout-order-data.json`을 만들고, 이 파일이 블로그의 `apps/blog/public/demos/number-flow/layout-lab.html`에 들어 있다. 같은 글자의 값 쓰기(`--current`와 숫자 요소의 `inert`)와 제거 뒤 삽입은 한 작업으로 합쳤다. 쓰기 뒤에 온 읽기의 수는 포크의 회귀 테스트 모델과 같다(같은 자릿수 13 → 1, 증가 14 → 2, 감소 34 → 2, 기호만 제거 7 → 1, 네이티브 엔진 12 → 1).

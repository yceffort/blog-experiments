# sticky z-index와 Layerize 비용

[z-index: 1이 Chrome의 레이어 합치기를 느리게 만드는 조건](https://yceffort.kr/2026/11/sticky-z-index-layerize)의 재현 페이지와 측정 스크립트, 결과다.

## 재현 페이지

`index.html` 하나다. 쿼리 문자열로 조건을 바꾼다.

| 파라미터 | 기본값 | 뜻                                                                                                                                     |
| -------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `z`      | `1`    | sticky 탭바의 `z-index`                                                                                                                |
| `k`      | `32`   | 탭바보다 먼저 칠해지는 `will-change: opacity` 점의 수(합쳐지지 않는 합성 레이어)                                                        |
| `n`      | `200`  | 탭바가 든 section 안의 줄 수                                                                                                           |
| `m`      | `0`    | section 밖, 아래에 붙이는 줄 수                                                                                                        |
| `clip`   | `1`    | `0`이면 줄 안 숫자의 `overflow: hidden`과 `border-radius`를 뺀다                                                                        |
| `fix`    | 없음   | 쉼표로 여러 개. `iso`(section `isolation: isolate`), `listwc`(목록 `will-change: transform`), `cpaint`(section `contain: paint`), `secwc`(section `will-change: transform`), `rowstatic`(줄과 숫자를 `position: static`), `bblock`(숫자를 줄 폭 전체 블록으로) |
| `trigger` | `toggle` | Layerize 전체 경로를 일으키는 변경. `toggle`(50ms마다 맨 위 4px 요소의 `will-change: opacity` 토글), `anim`(500ms마다 200ms짜리 opacity 애니메이션 재시작), `text`(50ms마다 화면 안 줄 숫자의 폭 변경), `scroll`(프레임마다 1px 스크롤), `none` |

기본 트리거인 `toggle`은 Layerize의 전체 경로(`PaintArtifactCompositor::Update`)를 계속 일으키기 위한 것이다.

## 실행

```sh
cd sticky-z-index-layerize
./run.sh
```

macOS의 Chrome Beta를 기본으로 쓴다. 다른 Chrome을 쓰려면 `CHROME=/path/to/chrome ./run.sh`로 실행한다. Node.js 22 이상이 필요하다(내장 `WebSocket`과 `fetch`를 쓴다). 프로필은 `work/`에 만든다.

- `measure.mjs`: CDP로 새 탭을 열고 390x844, DPR 3 모바일 화면과 CPU 4배 감속을 건다. 화면은 `VIEWPORT` 환경 변수(CDP `Emulation.setDeviceMetricsOverride` 인자 JSON)로 바꿀 수 있고, `run.sh`의 DPR 1 측정이 이것을 쓴다. 4초 기다린 뒤 10초 동안 `devtools.timeline`, `blink` 카테고리로 트레이스를 찍는다. 렌더러 메인 스레드의 `Layerize` 가운데 `PaintArtifactCompositor::Update`를 품은 것만 골라 1회 평균을 낸다.
- `layers.mjs`: CDP `LayerTree` 도메인으로 합성 레이어 목록과 합성 이유를 읽는다.
- `run.sh`: 조건 전체를 3번 잰다. 두 번째 반복은 조건 순서를 뒤집는다. 반복마다 기본 Chrome과 `--enable-features=LimitLayerMergeDistance:limit/16`을 켠 Chrome을 각각 새 프로필로 띄운다.
- `summarize.mjs`: `results/timing.jsonl`, `results/layers.jsonl`로 `results/summary.md`를 만든다.

## 흔한 화면 데모

글의 "흔한 화면으로 본 네 가지 조건" 절은 블로그에 올린 쇼핑 앱 홈 데모(`https://yceffort.kr/demos/sticky-z-index-layerize/pattern.html`)를 같은 `measure.mjs`로 잰 값이다. `?auto=1`을 붙이면 로드 직후부터 프레임마다 남은 수량을 바꾼다. 조건은 `z`(`1`, `auto`), `rows`(`relative`, `static`), `skel`(스켈레톤 막대 `24`, `8`, `0`), `live`(`1` 자릿수가 바뀌는 갱신, `same` `tabular-nums`로 같은 폭 갱신, `0` 갱신 없음)로 바꾼다.

```sh
PORT=9222 node measure.mjs "https://yceffort.kr/demos/sticky-z-index-layerize/pattern.html?auto=1&z=1&live=same"
```

- [`results/pattern-timing.jsonl`](results/pattern-timing.jsonl): 네 조건을 하나씩 바꾼 측정(3회씩)
- [`results/pattern-width.jsonl`](results/pattern-width.jsonl): 폭이 바뀌는 갱신과 같은 폭 갱신의 Layerize 전체 시간 합계(`layerizeMs`, 3회씩)

## 결과

[요약](results/summary.md), [측정값](results/timing.jsonl), [레이어 목록](results/layers.jsonl).

2026-11-21(KST) Apple M5, macOS 27.2.1의 Chrome Beta 159.0.8154.13에서 쟀다. 수치는 CPU 4배 감속을 건 값이다.

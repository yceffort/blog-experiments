# 번들러는 import를 어떻게 기억하는가: 실측 기록

2026-10-04 로컬 macOS(arm64), Node 24.20.0에서 측정했다. 버전은 `package-lock.json`으로 고정했다.

| 대상                                  | 버전                            |
| ------------------------------------- | ------------------------------- |
| webpack                               | 5.111.1                         |
| Next.js(Turbopack), Next 내장 webpack | 16.3.8, 내장 webpack 5.98.0     |
| Vite(빌드는 Rolldown)                 | 8.3.2, rolldown 1.2.12          |
| esbuild                               | 0.28.2                          |
| coldpath                              | 0.6.0(npm 배포본)               |
| 블로그                                | Next.js 16.3.5, 커밋 `f1ff09a9` |

재현 순서는 `npm ci`, `npm run build`, `node scripts/recovered.mjs <빌드 이름...>`, `node scripts/blog-edges.mjs <modules.data> <블로그 루트> <출력>`이다. 원자료는 `results/` 아래에 있다.

## 1. 픽스처

`fixtures/src/entry.js` 한 파일에 일곱 가지 경우를 넣었다. 각 의존 모듈은 산출물에서 찾을 수 있도록 고유 문자열(`M_*`)을 반환한다. 픽스처의 `package.json`에는 `"sideEffects": ["./src/side-effect.js"]`만 있고 `type` 필드는 없다(아래 `auto`). 같은 픽스처에 `"type": "module"`을 넣은 변형(`module`)도 빌드했고, 이때는 CJS 파일을 `.cjs`로 옮겨 남는 변수를 "ESM으로 판정된 `entry.js` 안의 `require()`" 하나로 좁혔다.

| 줄  | 경우                       | 코드                                                 |
| --- | -------------------------- | ---------------------------------------------------- |
| 1   | ESM이 ESM을 import         | `import {esmDep} from './esm-dep.js'`                |
| 2   | ESM이 CJS를 default import | `import cjsDefault from './cjs-default.js'`          |
| 3   | 부수 효과 import           | `import './side-effect.js'`                          |
| 4   | 쓰지 않는 import           | `import {unusedDep} from './unused-dep.js'`          |
| 5   | CJS를 require              | `const {cjsDep} = require('./cjs-dep.js')`           |
| 6   | ESM을 require              | `const {esmRequired} = require('./esm-required.js')` |
| 9   | 동적 import                | `import('./lazy-dep.js')`                            |

## 2. 그래프 정보에 남는 것

| 번들러(정보원)             | import와 require 구분                                                                            | 위치                                                   | 지정자        | 쓰지 않는 import                           |
| -------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ------------- | ------------------------------------------ |
| webpack stats `reasons`    | 함. `harmony side effect evaluation`, `harmony import specifier`, `cjs require`, `import()`      | 있음. 선언(`1:0-35`)과 사용처(`9:10-16`)가 따로 기록됨 | `userRequest` | 남음. orphan 모듈에 `active: false` reason |
| Turbopack `modules.data`   | 안 함. 정적 다섯 개가 모두 `module_dependencies`, 동적 하나만 `async_module_dependencies`        | 없음                                                   | 없음          | 그래프에서 아예 빠짐                       |
| Rolldown `getModuleInfo()` | 안 함. `importedIds` 7개에 import 4개, require 2개, Vite가 주입한 `\0vite/preload-helper.js` 1개 | 없음                                                   | 없음          | `importedIds`에 남음                       |
| esbuild metafile           | 함. `import-statement` 4, `require-call` 2, `dynamic-import` 1                                   | 없음                                                   | `original`    | `inputs`에는 남고 `outputs`에는 없음       |

- webpack은 `sideEffects`로 부수 효과 없음이 확인된 모듈의 선언 reason을 `inactive`로 바꾸고 사용처 reason만 살려 둔다(`esm-dep.js`, `cjs-default.js`).
- `modules.data` 헤더 키는 `modules`(각 원소는 `ident`, `path` 두 필드뿐), `module_dependents`, `async_module_dependents`, `traced_module_dependents`, `module_dependencies`, `async_module_dependencies`, `traced_module_dependencies`다.
- Rolldown의 `inputFormat`은 모듈 형식(`es`, `cjs`, 부수 효과 파일은 `unknown`)을 알려 준다. 간선 종류는 알려 주지 않는다.

## 3. 산출물에 남는 것

`auto` 변형, 축소한 빌드 기준이다(비축소본은 같은 디렉터리의 `-nomin`).

| 경우              | webpack 5.111.1 기본               | webpack `concatenateModules: false` | Next 내장 webpack 5.98.0        | Turbopack                           | Rolldown                         | esbuild                                   |
| ----------------- | ---------------------------------- | ----------------------------------- | ------------------------------- | ----------------------------------- | -------------------------------- | ----------------------------------------- |
| ESM → ESM         | 문자열까지 인라인                  | `r(211)`, `(0,n.n)()`               | 문자열까지 인라인               | 같은 팩토리로 병합                  | 최상위로 끌어올림                | 최상위로 끌어올림                         |
| ESM → CJS default | `r(678)`, `r.n(e)`                 | `r(678)`, `r.n(o)`                  | `n(5138)`, `n.n(t)`             | `e.i(9422)`                         | `__toESM(__commonJSMin(...)())`  | `__toESM(require_cjs_default())`          |
| 부수 효과         | `r(19)`                            | `r(19)`                             | `n(2199)`                       | `e.i(1323)`                         | 문장 인라인                      | 문장 인라인                               |
| require CJS       | `r(234)`                           | `r(234)`                            | `n(8030)`                       | `e.r(1934)`                         | `require_cjs_dep()`              | `require_cjs_dep()`                       |
| require ESM       | `r.cw(function(t,e){...})` 후 호출 | `r(949)`                            | `n(4979)`                       | `e.r(2989)`                         | `__toCommonJS(ns)`               | `(init_esm_required(), __toCommonJS(ns))` |
| 동적 import       | `r.e(132).then(()=>r(132))`        | 같음                                | `n.e(990).then(n.bind(n,6990))` | `e.A(3105)`, 로더 모듈이 `e.v(...)` | `__vitePreload(()=>import(...))` | `import(...)`                             |
| 쓰지 않는 import  | 없음                               | 없음                                | 없음                            | 없음                                | 없음                             | 없음                                      |

Turbopack 축소 산출물의 페이지 팩토리 일부:

```js
350,e=>{"use strict";var t=e.i(1398),r=e.i(9422);e.i(1323);let{cjsDep:n}=e.r(1934),{esmRequired:o}=e.r(2989);e.s(["default",0,function(){ ...
```

Next 내장 webpack 5.98.0 축소 산출물의 같은 자리:

```js
var E = n(72),
  t = n(5138),
  r = n.n(t)
n(2199)
let {cjsDep: s} = n(8030),
  {esmRequired: u} = n(4979)
```

이 입력에서 webpack의 stats는 import와 require를 구분하지만, 남은 `__webpack_require__(id)` 호출 자체는 구분하지 못한다. default 호환 함수는 5.98.0에도 있고, 모듈 연결은 호출과 경계를 없앨 수 있다. Turbopack의 분석 파일은 두 종류를 합치지만 남은 `e.i`와 `e.r` 호출은 구분된다. Rolldown과 esbuild의 형식 호환 도우미도 일부 단서가 되며, 합쳐진 ESM import는 별도 호출이 없다. 도우미만으로 모든 원래 구문을 구분할 수 있다는 결론은 아니다. 아래 추가 검증에 Vite 반례를 기록했다.

## 4. webpack 5.109 이후의 산출물 변화

- 5.109.0(2026-07-23)에서 정적으로 분석 가능한 CommonJS 모듈도 concatenation 대상이 됐고, 5.110.0(2026-08-27)에서 합친 모듈을 `__webpack_require__.cw` 지연 접근자로 감싸고 `require()`를 인라인하게 됐다(릴리스 노트).
- 픽스처의 CJS 파일은 `ModuleConcatenation bailout: Module is not in strict mode`로 합쳐지지 않았다. CJS 파일 두 개와 부수 효과 파일 맨 앞에 `'use strict'`만 붙이면(`results/builds/strict`) `./src/index.js + 6 modules` 하나로 모두 합쳐지고, 정적 의존성의 `__webpack_require__(id)` 호출이 산출물에서 사라진다. 남는 것은 동적 import의 `__webpack_require__(132)`뿐이다.
- Next.js 16.3.8은 webpack 5.98.0을 내장하고 있어 `cw`가 없다. Next의 webpack 모드 사용자는 여전히 `n(id)` 모듈 표를 본다.

## 5. `"type": "module"` 패키지 안의 `require()`

| 번들러                   | 빌드 결과                  | 산출물                                                                                                                                                                        |
| ------------------------ | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webpack 5.111.1          | 성공, errors 0, warnings 0 | `require('./cjs-dep.cjs')`가 그대로 남음. stats 그래프에 `cjs-dep.cjs`, `esm-required.js`가 없음. `require`가 없는 환경에서 실행하면 `ReferenceError: require is not defined` |
| Next 내장 webpack 5.98.0 | 실패                       | 서버 번들이 프리렌더 단계에서 `Cannot find module './cjs-dep.cjs'`                                                                                                            |
| Turbopack                | 성공, 경고 없음            | `e.r(id)`로 번들                                                                                                                                                              |
| Rolldown                 | 성공, 경고 없음            | 번들. `__toESM(..., 1)`로 Node 호환 모드 interop                                                                                                                              |
| esbuild                  | 성공, 경고 없음            | 번들. `__toESM(require_cjs_default(), 1)`                                                                                                                                     |

## 6. 산출물에서 복원한 그래프(`coldpath modules --graph`, 소스맵 제외)

| 빌드                             | 픽스처 간선                           | 비고                                                                                                                           |
| -------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Next 내장 webpack                | `unknown` 4, `dynamic` 1              | 3탄에서 쓴 상황과 같음                                                                                                         |
| webpack 5.111.1 concatenation 끔 | `unknown` 6                           | 동적 import까지 `unknown`. `deferredCall`이 화살표 함수(`()=>r(132)`)를 내면 coldpath가 `bind` 형태만 동적으로 인식해서 놓친다 |
| webpack 5.111.1 기본             | 0                                     | entry가 런타임 IIFE 안에 있어 팩토리가 아님                                                                                    |
| Turbopack                        | `static` 2(`e.i`), `require` 2(`e.r`) | 그래프 파일보다 정확함                                                                                                         |
| Rolldown, esbuild                | 복원 모듈 0                           | 출력 디렉터리가 없으면 `ENOENT`로 종료함                                                                                       |

## 7. 블로그 실측

`next experimental-analyze --output`(13.5초)과 `next build`를 같은 커밋 `f1ff09a9`에서 실행했다.

- `modules.data`: 모듈 6,659개. 클라이언트 동기 간선을 서로 다른 경로 쌍으로 세면 3,600개다. 가져오는 쪽 소스를 파싱해 지정자를 Node 규칙으로 풀어 본 결과는 import 2,051, require 588, 판정 못 함 961(가져오는 쪽에 문자열 지정자의 `require`가 있는 201, 없는 760)이다. 대응시킨 require는 588개(16.3%)이며, 이 소스 기반 집계만으로 전체 require 간선의 상한을 정하지 않는다.
- require 588개는 모두 `node_modules` 안쪽(주로 `next/dist`의 CJS 산출물)에서 나왔다. 워크스페이스 코드의 간선 193개는 import 16개, 판정 못 함 177개였다. 177개의 대상은 블로그 파일 91(`@/` 별칭 46, 확장자 생략 상대 경로 28, `@yceffort/shared` 하위 경로 10, 배럴 파일을 건너뛴 간선 6, 이미지 모듈 1), 패키지 46(Next 별칭, 조건부 해석, pnpm 피어 조합별 `next` 사본 등), `jsx-runtime` 38, 폴리필 2다(2026-10-08 블로그 `f1ff09a9` 워크트리에서 재집계).
- 판정 못 한 간선의 예: `process` 폴리필, SWC가 주입한 `@swc/helpers`, JSX 변환이 주입한 `jsx-runtime`, `react`를 `next/dist/compiled/react`로 바꾸는 별칭. 소스에 그 모양 그대로는 없는 간선이다.
- 산출물 복원 그래프: JS 109개, 91개 청크에서 팩토리 677개(중복 제거 339개), 간선 986개 중 `static` 456, `require` 496, `dynamic` 34. 복원하지 못한 id를 가리키는 호출 527개는 빠졌다. scope hoisting은 ESM 간선을 없애므로 비율에 영향을 줄 수 있지만, 두 집계의 모집단과 복원 범위가 달라 비율 차이 전체를 그 효과로 해석할 수는 없다.

## 8. coldpath 0.6.0 오분류의 영향

`fixtures/impact`: 페이지가 `heavy-esm.js`를 정적 import하고 `heavy-cjs.js`를 `require()`하며, 둘 다 버튼을 눌러야 쓰인다.

- `coldpath graph --format turbopack`: 127 modules, 284 edges, import locations 3개. `index.jsx -> heavy-cjs.js` 간선은 `static`, 위치 없음.
- 첫 진입과 CJS 버튼 클릭 두 시나리오로 수집해 분석하자 `heavy-cjs.js`에 `split-review`가 붙었다. 설명은 "A static import chain reaches this source, and part of it executes initially."다.
- 그 간선 하나만 `require`로 바꾼 대조 그래프에서는 같은 모듈이 `inspect-imports`(경로 `static>require`)가 됐다.
- 원인은 `lib/graph.ts`의 `turbopackGraph`가 `module_dependencies`를 모두 `static`으로 매핑하는 것이고, `enrichLocations`는 종류가 다른 `require` 위치를 붙이지 않는다.

수정 후(coldpath 0.6.1로 측정, npm 배포본 0.8.0도 그래프 간선과 제안이 같음): 동기 간선은 가져오는 파일을 파싱해 `require()` 자리와 맞으면 `require`, `require()`를 쓰는 파일에서 어느 자리와도 맞지 않으면 `unknown`, 나머지는 `static`으로 둔다. 패키지 지정자는 가져오는 파일에서 Node.js `require` 해석으로 풀고, 패키지 `exports`에 선언된 파일도 후보로 비교한다.

| 측정                                    | 0.6.0                        | 수정 후                                                    |
| --------------------------------------- | ---------------------------- | ---------------------------------------------------------- |
| 영향 픽스처 `index.jsx -> heavy-cjs.js` | `static`, 위치 없음          | `require`, 3행 18열                                        |
| 영향 픽스처 `heavy-cjs.js` 제안         | `split-review`               | `inspect-imports`                                          |
| 영향 픽스처 위치가 붙은 간선            | 284개 중 3                   | 284개 중 245                                               |
| 블로그 그래프 간선                      | 3,945                        | 3,966(서로 다른 쌍은 둘 다 3,941)                          |
| 블로그 그래프 종류                      | `static` 3,881, `dynamic` 64 | `static` 3,052, `require` 678, `unknown` 172, `dynamic` 64 |
| 블로그 그래프 위치가 붙은 간선          | 2,083                        | 2,895                                                      |
| 블로그 코드에서 나가는 간선             | `static` 208, `dynamic` 4    | 같음                                                       |

coldpath 0.6.0의 Vite 플러그인은 같은 픽스처에서 `cjs-dep.js`(5행 18열)와 `esm-required.js`(6행 23열)를 이미 `require`로 분류했다(`transform` 훅에서 소스를 파싱하기 때문).

이 결과가 입증하는 것은 간선 재분류와 위치 보강, 픽스처의 설명 및 제안 분기 변경이다. 실제 분리 후 동작이나 전송량을 비교하지 않았으므로 지연 로딩 제안의 안전성 개선까지 입증하지 않는다. 소스와 대응하지 못한 일부 간선은 `static` 추정으로 남으며, 가상 모듈 `page-loader`의 호출도 여기에 포함된다. 이후 분류 수정은 `58b1a6a`, 패키지 지정자 대응은 `fec91ef`로 커밋됐다.

## 추가 검증: Vite에서 서로 다른 구문이 같은 산출물이 되는 경우

추가 실험 조건은 2026-10-05, Node.js 24.20.0, Vite 8.3.2, Rolldown 1.2.12다. `node scripts/interop-counterexample.mjs`로 재현한다. 입력과 산출물 원문은 `results/interop-counterexample.json`에 있다.

- 부수 효과와 `module.exports`가 있는 `dep.cjs`를 `import './dep.cjs'` 또는 `require('./dep.cjs')`로 가져온다. 두 입력 모두 이어서 `globalThis.finished = true`를 실행한다.
- 두 프로덕션 축소 산출물이 완전히 같았다. 부수 효과는 남았지만 네임스페이스 호환 함수는 필요하지 않아 같은 CommonJS 래퍼 호출로 합쳐졌다.
- 이 추가 실험은 Vite에 한정한다. esbuild에서 같은 결과라고 일반화하지 않는다.
- Next.js v16.3.8 `runtime-utils.ts`의 `esmExport`(221~239행)는 `module.namespaceObject = exports`로 지정한다. 일반적인 동기 ESM에서는 `i`와 `r`이 같은 객체를 반환할 수 있다.
- coldpath 수정 커밋 `90b7baa`는 청크 로드 뒤의 화살표 함수를 동적 간선으로 인식하지만, `Promise.resolve().then(() => n(id))`는 require와 구별할 수 없어 `unknown`으로 남긴다.

## 9. 소스 근거(태그 고정)

`*`는 직접 원문과 대조한 인용이다. 나머지는 서브에이전트가 태그의 원문을 내려받아 확인했다고 보고한 것이다.

- webpack v5.111.1
  - `RuntimeTemplate.importStatement`가 `__webpack_require__(id)`를 만든다: https://github.com/webpack/webpack/blob/v5.111.1/lib/RuntimeTemplate.js#L2394
  - require는 `CommonJsRequireDependency`가 인자를 id로, `RequireHeaderDependency`가 `require`를 `__webpack_require__`로 바꾼다: https://github.com/webpack/webpack/blob/v5.111.1/lib/dependencies/CommonJsRequireDependency.js#L330-L337, https://github.com/webpack/webpack/blob/v5.111.1/lib/dependencies/RequireHeaderDependency.js#L106-L107
  - stats `type` 문자열: https://github.com/webpack/webpack/blob/v5.111.1/lib/stats/DefaultStatsFactoryPlugin.js#L1548, https://github.com/webpack/webpack/blob/v5.111.1/lib/dependencies/CommonJsRequireDependency.js#L102-L104
  - `*` `deferredCall`의 화살표 함수와 `bind` 분기: `lib/RuntimeTemplate.js` 로컬 사본 1593~1597행
  - `*` `concatenationWrap = "__webpack_require__.cw"`: `lib/RuntimeGlobals.js` 로컬 사본 79행
- Next.js v16.3.8
  - `*` `modules.data` 간선 분류는 `ChunkingType`만 본다(`Async`는 async, `Traced`는 traced, 나머지 `_`는 모두 `module_dependencies`): https://github.com/vercel/next.js/blob/v16.3.8/crates/next-api/src/analyze.rs#L515-L541
  - `*` ESM import는 `Parallel { inherit_async: true, hoisted: true }`: https://github.com/vercel/next.js/blob/v16.3.8/turbopack/crates/turbopack-ecmascript/src/references/esm/base.rs#L672-L686
  - `*` CJS require는 `Parallel { inherit_async: false, hoisted: false }`: https://github.com/vercel/next.js/blob/v16.3.8/turbopack/crates/turbopack-ecmascript/src/references/cjs.rs#L152-L162
  - 런타임 축약 키(`i`, `r`, `A`, `s`, `v`, `l`): https://github.com/vercel/next.js/blob/v16.3.8/turbopack/crates/turbopack-ecmascript/src/runtime_functions.rs#L56-L82
  - `esmImport`, `asyncLoader`, `commonJsRequire`: https://github.com/vercel/next.js/blob/v16.3.8/turbopack/crates/turbopack-ecmascript-runtime/js/src/shared/runtime/runtime-utils.ts#L467-L515
- Rolldown v1.2.11(설치본은 1.2.12)
  - `importedIds`에 `Import`, `Require`, `NewUrl`이 함께 들어간다: https://github.com/rolldown/rolldown/blob/v1.2.11/crates/rolldown/src/module_loader/module_task.rs#L157-L171
  - `__commonJSMin`, `__toESM`, `__toCommonJS`: https://github.com/rolldown/rolldown/blob/v1.2.11/crates/rolldown/src/runtime/runtime-base.js#L8-L74
- esbuild v0.28.2
  - `StringForMetafile`: https://github.com/evanw/esbuild/blob/v0.28.2/internal/ast/ast.go#L43-L64
  - metafile `imports[]`에는 `path`, `kind`, `original`만 쓴다: https://github.com/evanw/esbuild/blob/v0.28.2/internal/bundler/bundler.go#L2516-L2521

## 확인하지 못한 것

- 같은 대상을 import와 require로 동시에 가져올 때 `modules.data`가 간선 하나로 합치는지는 소스(`(parent, node)` 쌍의 집합)로만 확인했고 빌드로는 재지 않았다.
- dev 서버(Next dev, Vite dev)의 그래프와 산출물은 재지 않았다.
- Vite 7 이하(Rollup 빌드)는 재지 않았다.
- webpack에서 CJS를 이름 붙인 import(`import {x} from './cjs'`)로 가져오는 경우는 픽스처에 없다.
- Rolldown 인용은 v1.2.11 태그 기준이고 설치본은 1.2.12다. 두 버전 사이 해당 파일의 차이는 확인하지 않았다.

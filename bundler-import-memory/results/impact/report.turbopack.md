# coldpath

Generated UTF-8 bytes: **427329** across 15 selected bundles.

| Observed | Unobserved | Unmeasured |
| ---: | ---: | ---: |
| 117396 B | 273670 B | 36263 B |

Unobserved means not executed during the supplied scenarios, not safe to delete.

0 bundles excluded by CLI/config filters; totals and budgets use selected bundles only.

| Package | Generated B | Unobserved B | Unmeasured B |
| --- | ---: | ---: | ---: |
| react-dom | 206962 | 153454 | 0 |
| next | 155561 | 88588 | 16377 |
| &#91;application&#93; | 31582 | 15347 | 9590 |
| react | 24552 | 13806 | 8184 |
| scheduler | 3509 | 1447 | 0 |
| &#91;unmapped&#93; | 3095 | 262 | 1423 |
| @swc/helpers | 2068 | 766 | 689 |

## Scenario: initial

109757 B observed · 281309 B unobserved · 36263 B unmeasured.

## Scenario: click-cjs

117396 B observed · 273670 B unobserved · 36263 B unmeasured.

Compared with the initial scenario. Interaction-only ranges are candidates for investigation; they do not prove loading time or removable bytes.

| Source | Interaction only B (initial measured) | Later observed B (initial unmeasured) |
| --- | ---: | ---: |
| turbopack:///&#91;project&#93;/node_modules/react-dom/cjs/react-dom-client.production.js | 6391 | 0 |
| turbopack:///&#91;project&#93;/fixtures/impact/src/heavy-cjs.js | 1230 | 0 |
| turbopack:///&#91;project&#93;/fixtures/impact/next-app/pages/index.jsx | 18 | 0 |

## Review actions

Compressed figures are isolated-fragment estimates, not additive transfer savings. Rebuild after changes to measure savings.

| Source | Scenario | Action | Candidate B | Estimated gzip B | Evidence |
| --- | --- | --- | ---: | ---: | --- |
| turbopack:///&#91;project&#93;/node_modules/react-dom/cjs/react-dom-client.production.js | click-cjs | inspect-imports | 6391 | — | These measured bytes execute in this interaction but not initially. Inspect the import graph and side effects before choosing a lazy-loading boundary.  |
| turbopack:///&#91;project&#93;/fixtures/impact/src/heavy-cjs.js | click-cjs | split-review | 1230 | — | A static import chain reaches this source, and part of it executes initially. Consider separating the later-only functionality before introducing import(); deferring the whole module may break initial behavior. &#91;next&#93;/entry/page-loader.ts → fixtures/impact/next-app/pages/index.jsx (Static); fixtures/impact/next-app/pages/index.jsx → fixtures/impact/src/heavy-cjs.js (Static) |
| turbopack:///&#91;project&#93;/fixtures/impact/next-app/pages/index.jsx | click-cjs | split-review | 18 | — | A static import chain reaches this source, and part of it executes initially. Consider separating the later-only functionality before introducing import(); deferring the whole module may break initial behavior. &#91;next&#93;/entry/page-loader.ts → fixtures/impact/next-app/pages/index.jsx (Static) |

8 analysis warnings.

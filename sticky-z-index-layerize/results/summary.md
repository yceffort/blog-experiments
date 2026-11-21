브라우저: Chrome/159.0.8154.13

| 빌드 | 조건 | 전체 경로 횟수 | 1회 평균(ms) 중앙값 | 3회 값 |
| --- | --- | --- | --- | --- |
| default | `z=1&k=0&n=200` | 200/200/200 | 0.47 | 0.44 / 0.50 / 0.47 |
| default | `z=1&k=16&n=200` | 200/200/200 | 1.19 | 1.19 / 1.26 / 1.18 |
| default | `z=1&k=32&n=200` | 200/200/200 | 2.08 | 2.08 / 2.08 / 2.07 |
| default | `z=1&k=48&n=200` | 200/200/200 | 3.02 | 3.11 / 2.97 / 3.02 |
| default | `z=auto&k=0&n=200` | 200/200/200 | 0.39 | 0.39 / 0.39 / 0.32 |
| default | `z=auto&k=16&n=200` | 200/200/200 | 0.41 | 0.41 / 0.41 / 0.34 |
| default | `z=auto&k=32&n=200` | 200/200/200 | 0.44 | 0.47 / 0.44 / 0.40 |
| default | `z=auto&k=48&n=200` | 200/200/200 | 0.44 | 0.47 / 0.44 / 0.39 |
| default | `z=0&k=32&n=200` | 200/200/200 | 0.45 | 0.45 / 0.45 / 0.33 |
| default | `z=201&k=32&n=200` | 200/200/200 | 2.05 | 2.18 / 2.05 / 2.04 |
| default | `z=1&k=32&n=200&clip=0` | 200/200/200 | 0.11 | 0.14 / 0.11 / 0.11 |
| default | `z=1&k=32&n=100&m=100` | 200/200/200 | 2.04 | 2.17 / 2.01 / 2.04 |
| default | `z=auto&k=32&n=100&m=100` | 200/200/200 | 0.40 | 0.41 / 0.40 / 0.33 |
| default | `z=1&k=32&n=100&m=100&fix=iso` | 200/200/200 | 1.24 | 1.26 / 1.24 / 1.20 |
| default | `z=1&k=32&n=100&m=100&fix=listwc` | 200/200/200 | 1.24 | 1.21 / 1.24 / 1.24 |
| default | `z=1&k=32&n=100&m=100&fix=iso,listwc` | 200/200/200 | 0.37 | 0.46 / 0.37 / 0.37 |
| default | `z=1&k=32&n=100&m=100&fix=cpaint` | 200/200/200 | 2.58 | 2.58 / 2.55 / 2.58 |
| default | `z=1&k=32&n=100&m=100&fix=secwc` | 200/200/200 | 0.41 | 0.40 / 0.46 / 0.41 |
| limit16 | `z=1&k=32&n=200` | 200/200/200 | 0.44 | 0.45 / 0.44 / 0.42 |
| limit16 | `z=auto&k=32&n=200` | 200/200/200 | 0.40 | 0.46 / 0.39 / 0.40 |
| limit16 | `z=1&k=48&n=200` | 200/200/200 | 0.43 | 0.44 / 0.41 / 0.43 |
| default | `z=auto&k=32&n=200&clip=0` | 200/200/200 | 0.15 | 0.15 / 0.15 / 0.13 |
| default | `z=1&k=32&n=200&fix=rowstatic` | 200/200/200 | 0.27 | 0.27 / 0.26 / 0.28 |
| default | `z=auto&k=32&n=200&fix=rowstatic` | 200/200/200 | 0.28 | 0.25 / 0.28 / 0.28 |
| dpr1 | `z=1&k=32&n=200&clip=0` | 200/200/200 | 0.63 | 0.61 / 0.66 / 0.63 |
| dpr1 | `z=auto&k=32&n=200&clip=0` | 200/200/200 | 0.24 | 0.30 / 0.22 / 0.24 |
| dpr1 | `z=1&k=32&n=200&clip=0&fix=bblock` | 200/200/200 | 0.13 | 0.13 / 0.14 / 0.13 |
| dpr1 | `z=auto&k=32&n=200&clip=0&fix=bblock` | 200/200/200 | 0.17 | 0.17 / 0.13 / 0.19 |
| default | `z=1&k=32&n=50` | 200/200/200 | 0.62 | 0.52 / 0.62 / 0.68 |
| default | `z=auto&k=32&n=50` | 200/200/200 | 0.17 | 0.16 / 0.17 / 0.18 |
| default | `z=1&k=32&n=100` | 200/200/200 | 1.07 | 1.02 / 1.11 / 1.07 |
| default | `z=auto&k=32&n=100` | 200/200/200 | 0.32 | 0.28 / 0.35 / 0.32 |
| default | `z=1&k=32&n=150` | 200/200/200 | 1.51 | 1.51 / 1.44 / 1.56 |
| default | `z=auto&k=32&n=150` | 200/200/200 | 0.28 | 0.29 / 0.25 / 0.28 |
| default | `z=1&k=32&n=200&trigger=anim` | 40/40/40 | 2.08 | 2.08 / 2.01 / 2.11 |
| default | `z=1&k=32&n=200&trigger=text` | 200/200/200 | 2.12 | 2.12 / 2.08 / 2.40 |
| default | `z=1&k=32&n=200&trigger=scroll` | 0/0/0 | 0.00 | 0.00 / 0.00 / 0.00 |
| default | `z=1&k=32&n=200&trigger=none` | 0/0/0 | 0.00 | 0.00 / 0.00 / 0.00 |

| 빌드 | 조건 | 레이어 수 | sticky 뒤 레이어 |
| --- | --- | --- | --- |
| default | `z=1&k=32&n=200` | 40 | (no node) Viewport<br>(no node) Scrollbar<br>(no node) Scrollbar |
| default | `z=auto&k=32&n=200` | 41 | div.row Overlap<br>(no node) Viewport<br>(no node) Scrollbar<br>(no node) Scrollbar |
| default | `z=1&k=32&n=100&m=100&fix=iso` | 41 | div.row Overlap<br>(no node) Viewport<br>(no node) Scrollbar<br>(no node) Scrollbar |
| default | `z=1&k=32&n=100&m=100&fix=cpaint` | 40 | (no node) Viewport<br>(no node) Scrollbar<br>(no node) Scrollbar |
| limit16 | `z=1&k=32&n=200` | 41 | (no node) Viewport<br>(no node) Scrollbar<br>(no node) Scrollbar |
| limit16 | `z=auto&k=32&n=200` | 41 | div.row Overlap<br>(no node) Viewport<br>(no node) Scrollbar<br>(no node) Scrollbar |
| limit16 | `z=1&k=48&n=200` | 57 | (no node) Viewport<br>(no node) Scrollbar<br>(no node) Scrollbar |

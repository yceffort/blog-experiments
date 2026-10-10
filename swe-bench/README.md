# SWE-bench TypeScript 문항 분석

블로그 글 `swe-bench-before-swapping-models`에 사용한 데이터 분석 코드와 집계 결과다. 공개 데이터셋의 테스트 기록과 패치를 읽으며, 모델을 호출하거나 저장소의 코드를 실행하지 않는다. Claude Code와 후보 모델을 연결해 문항을 풀고 채점하는 실험은 아직 수행하지 않았다.

## 입력 데이터

2026-10-08에 확인한 다음 리비전을 고정했다. 스크립트는 모든 입력 파일의 SHA-256을 검사한다. mini와 flash의 해시는 Hugging Face의 해당 리비전 LFS 메타데이터와도 대조했다.

| 데이터셋                                                                                                                           | 리비전                                     | 입력                          |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ----------------------------- |
| [Multi-SWE-bench](https://huggingface.co/datasets/ByteDance-Seed/Multi-SWE-bench/tree/56ff018c04a38e27ada1e9d0a6d5839a51f88f0d/ts) | `56ff018c04a38e27ada1e9d0a6d5839a51f88f0d` | `ts/` 아래 JSONL 3개          |
| [mini](https://huggingface.co/datasets/ByteDance-Seed/Multi-SWE-bench_mini/tree/d0fab3ccc7dff232fcaac234cf8af9a2efeaccf6)          | `d0fab3ccc7dff232fcaac234cf8af9a2efeaccf6` | `multi_swe_bench_mini.jsonl`  |
| [flash](https://huggingface.co/datasets/ByteDance-Seed/Multi-SWE-bench-flash/tree/b0485dbebaf8a1317ebf140e80e6fc6c02d3502b)        | `b0485dbebaf8a1317ebf140e80e6fc6c02d3502b` | `multi_swe_bench_flash.jsonl` |

원본 JSONL은 합계 약 1.2GB다. 저장소에 복사하지 않고 다운로드한 경로를 인자로 전달한다. Python 3.9 이상과 표준 라이브러리만 필요하다.

```sh
python3 audit-typescript.py /path/to/ts \
  --mini /path/to/multi_swe_bench_mini.jsonl \
  --flash /path/to/multi_swe_bench_flash.jsonl \
  > results/typescript-audit.json
```

mini와 flash 인자를 생략하면 전체 세트만 분석한다. 전체 세트 파일명은 `darkreader__darkreader_dataset.jsonl`, `mui__material-ui_dataset.jsonl`, `vuejs__core_dataset.jsonl`이다.

## 집계 기준과 결과

기본 조건은 f2p 목록에 있으면서 테스트 패치가 수정하지 않은 파일에 속하고, 패치 없음 / 테스트 패치 / 두 패치 적용 순서의 기록이 `PASS/FAIL/PASS`인 테스트다. 구현 변경을 적용하기 전부터 결과가 달라지는 사례를 조사하기 위한 조건이다. 테스트 간 간섭이나 실행 환경의 영향은 따로 확인하지 않았으며, 불안정한 테스트라고 확정한 결과가 아니다.

테스트 파일을 고치지 않아도 테스트 패치가 그 테스트의 기대값을 바꿀 수 있다. 그래서 테스트 패치가 다음 파일을 고친 테스트는 두 조건에서 모두 제외하고, 결과 JSON의 `test_patch_dependencies`에 이유와 함께 남긴다.

- 같은 디렉터리의 `__snapshots__/<테스트 파일>.snap` (vuejs/core 2문항, 16개 테스트)
- 테스트 파일 이름에서 확장자를 뺀 픽스처 디렉터리 (mui/material-ui 1개 테스트, 같은 문항의 다른 테스트가 남아 문항 수는 그대로)
- 테스트 파일 디렉터리 아래에서 테스트 ID의 끝과 경로가 같은 디렉터리 (mui/material-ui 1문항, 1개 테스트)

이 규칙은 데이터에서 확인한 의존 관계만 다룬다. 공용 헬퍼나 설정 파일을 거치는 간접적인 의존은 걸러 내지 못한다.

`FAIL/FAIL/PASS`도 별도로 집계한다. 이 경우에는 구현 변경 전 두 실행에서 결과가 같으므로 기본 조건과 구분한다. 확대 집계는 두 패턴 중 하나 이상이 있는 문항의 합집합이다. 한 문항에 두 패턴이 있어도 한 번만 센다.

| 범위                  | TypeScript 문항 | 기본 조건 | 확대 조건 |
| --------------------- | --------------- | --------- | --------- |
| 전체                  | 224             | 31        | 34        |
| vuejs/core            | 48              | 22        | 24        |
| mui/material-ui       | 174             | 9         | 10        |
| darkreader/darkreader | 2               | 0         | 0         |
| mini                  | 50              | 6         | 6         |
| flash                 | 45              | 20        | 20        |

부분집합의 TypeScript 문항은 전체 세트의 TypeScript 저장소와 문항 ID로 대응시킨다. 모든 대응 문항에서 f2p 목록과 테스트 패치가 전체 세트와 같은지 확인하며, 다르면 집계를 중단한다. 각 문항 ID와 테스트 이름, 세 실행의 상태는 [결과 JSON](results/typescript-audit.json)에 있다.

기존 분석도 함께 재현한다. 정답 패치의 변경 파일은 `.ts` 또는 `.tsx`를 포함한 문항 146개, `.d.ts`만 포함한 문항 13개, 셋 모두 없는 문항 65개로 나뉜다. `.d.ts`는 `.ts`에서 제외한다. f2p가 빈 문항은 23개다. 이 수치로 해당 문항이 빈 패치를 통과시킨다고 판단해서는 안 된다.

## 채점기 확인 범위

채점기 커밋은 [`24f493f8a103e72312ded4f6b9c89f081d69cb09`](https://github.com/multi-swe-bench/multi-swe-bench/tree/24f493f8a103e72312ded4f6b9c89f081d69cb09)이다. `gen_report.py`는 목록 대조 전에 `report.valid`를 확인하고, `Report.check()`는 결과 수집 여부, 새로운 실패, 비통과에서 통과로의 변화, 별도의 이상 패턴을 검사한다. 여기서 비통과에는 `FAIL` 외에 `SKIP`과 `NONE`도 포함된다.

이 저장소의 집계 스크립트는 채점기를 대체하지 않는다. 저장된 기록의 패턴을 찾는 용도이며, 동일한 코드와 환경에서 테스트를 반복 실행해 불안정성을 검증한 실험은 아니다.

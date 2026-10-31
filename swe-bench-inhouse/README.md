# 사내 문항으로 돌린 Claude Code 모델 비교의 실행별 집계

블로그 글 `in-house-swe-bench-from-merged-prs`(2편)와 `claude-code-model-swap-results`(3편)에 쓴 실행별 집계다. 문항과 채점기는 사내 코드와 정답 패치를 포함하고 있어 공개하지 않는다. 여기에는 실행 하나마다 판정, 턴, 시간, 토큰, 품질 지표를 한 줄로 적은 CSV 와, 그것을 글의 표로 다시 집계하는 스크립트만 있다.

## 파일

- `results/runs.csv`: 실행 1,164건. 한 줄이 "모델 하나가 문항 하나를 한 회차에 푼 실행" 하나다.
- `results/items.json`: 문항 36개의 트랙, f2p 와 p2p 테스트 수, 쪼갠 문항 여부, 인터페이스 명세 유무.
- `aggregate.py`: CSV 를 읽어 모델별 표와 턴 수 분포를 출력한다. Python 3.9 이상, 표준 라이브러리만 쓴다.

```sh
python3 -I aggregate.py results/runs.csv
```

## 익명화

- 문항은 PR 단위로 묶어 `A`~`R` 로 바꿨다. `K4` 처럼 숫자가 붙은 것은 한 PR 을 주제별로 쪼갠 문항이고, 같은 글자의 문항은 같은 코드 영역을 다루므로 독립 표본이 아니다. `items.json` 의 순서가 실행 순서다.
- 모델은 공개 모델명으로 적었다. 어느 게이트웨이와 경로로 호출했는지는 적지 않았다.
- 패치 내용, 에이전트 출력, 문제 설명은 포함하지 않는다.

## `set` 열

| 값 | 뜻 |
| --- | --- |
| `isolated` | 작업 디렉터리를 홈 밖에 두어 개인 지침이 들어가지 않은 실행. 3편의 본 비교(Claude Sonnet 5.5, GLM 5.3)와 부록(GPT-6 Luna, Gemini 4종)이 여기 있다 |
| `discarded` | 첫 실행 488회. 상위 디렉터리의 개인 `CLAUDE.md` 가 에이전트에 들어간 상태라 모델 비교에서 뺐다. `claude_md_injected` 가 1 이다 |
| `relax` | `discarded` 와 같은 조건에 한도만 60분, 150턴으로 늘려 명세 트랙 14문항을 1회 돌린 실행. 역시 지침이 들어간 상태다. Qwen3.8-27B 의 3문항은 게이트웨이 오류로 실행되지 않아 `status` 가 `infra_failure` 다 |

## 열 설명

| 열 | 뜻 |
| --- | --- |
| `round` | 회차. 같은 문항을 처음부터 다시 푼 횟수다 |
| `track` | `basic` 은 문제 설명만, `spec` 은 인터페이스 명세를 함께 준 문항 |
| `status` | 채점기 판정. `resolved`, `unresolved`, `infra_failure` |
| `resolved` | `status` 가 `resolved` 또는 `resolved_after_rerun` 이면 1 |
| `timed_out` | 문항당 시간 한도(`timeout_secs`)로 강제 종료된 실행. 이때 Claude Code 의 결과 이벤트가 없어 `num_turns` 와 토큰이 비어 있다 |
| `max_turns_hit` | Claude Code 가 `error_max_turns` 로 끝난 실행 |
| `num_turns` | Claude Code 결과의 `num_turns`. 한도보다 크게 보고되는 경우가 있다 |
| `secs` | 실행에 걸린 초. 여러 모델을 같은 게이트웨이에 동시에 돌렸으므로 모델 사이의 시간 비교에는 그 영향이 섞여 있다 |
| `input_tokens`, `cache_read_tokens`, `cache_creation_tokens`, `output_tokens` | Claude Code 결과의 `usage` |
| `tool_calls` | stream-json 의 assistant 이벤트에서 센 도구 호출 수 |
| `permission_denials` | 허용 목록 밖이라 거부된 도구 호출 수 |
| `empty_patch` | 코드를 한 줄도 바꾸지 않고 끝난 실행. 품질 지표는 비어 있다 |
| `tsc_new_errors`, `eslint_new_errors`, `format_new_violations` | 정답 상태를 기준선으로, 모델 패치에서 새로 생긴 수. 채점과 같은 상태(모델의 비테스트 변경 + PR 테스트 패치)에서 쟀다 |
| `diff_lines` | 테스트가 아닌 코드 파일의 추가와 삭제 줄 수 |
| `size_ratio_vs_gold` | 정답 패치(쪼갠 문항은 그 주제의 부분 정답) 대비 변경 크기 |
| `added_comment_lines` | 패치가 추가한 주석 줄 수 |
| `tool_read`, `tool_edit`, `tool_write`, `tool_bash`, `tool_grep`, `tool_glob`, `tool_other` | stream-json 의 assistant 이벤트에서 센 도구별 호출 수. `tool_other` 는 그 밖의 이름으로 들어온 호출(깨진 도구 이름 포함) |
| `test_files_touched` | 모델 패치에서 채점 전에 걷어낸 테스트 파일 수 |
| `added_any`, `added_suppressions` | 패치가 추가한 `any` 와 린트 억제 주석 수 |
| `thinking_tokens` | Claude Code 결과의 `usage.output_tokens_details.thinking_tokens`. 게이트웨이가 보고하지 않으면 0 |

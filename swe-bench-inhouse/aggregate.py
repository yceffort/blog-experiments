"""results/runs.csv 를 집계해 블로그 2편, 3편의 표를 다시 만든다. 표준 라이브러리만 쓴다.

usage: python3 -I aggregate.py [results/runs.csv]
"""
import csv, statistics as st, sys
from collections import Counter, defaultdict

path = sys.argv[1] if len(sys.argv) > 1 else "results/runs.csv"
rows = list(csv.DictReader(open(path, encoding="utf-8")))


def num(v):
    return float(v) if v not in ("", None) else None


def med(xs):
    xs = [x for x in xs if x is not None]
    return round(st.median(xs), 1) if xs else "-"


groups = defaultdict(list)
for r in rows:
    groups[(r["set"], r["model"])].append(r)

print("| set | model | runs | basic | spec | 3회 모두 해결 basic/spec | 회차마다 바뀐 문항 | 한 번도 못 푼 문항 | 턴 중앙값 | 초 중앙값 | 소요 합(h) | 턴 한도 도달(해결) | 시간 한도 | 입력측 토큰 | 출력 토큰 | tsc | eslint | 포맷 | 변경 줄 중앙값 | 주석 줄 |")
print("| --- | --- | ---: | ---: | ---: | --- | ---: | --- | ---: | ---: | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |")
for (s, m), rs in sorted(groups.items()):
    by_item = defaultdict(list)
    for r in rs:
        by_item[r["item"]].append(r["resolved"] == "1")
    rounds = max(int(r["round"]) for r in rs)
    full = {i: v for i, v in by_item.items() if len(v) == rounds}
    tr = {r["item"]: r["track"] for r in rs}
    res = {t: f"{sum(r['resolved']=='1' for r in rs if r['track']==t)}/{sum(1 for r in rs if r['track']==t)}" for t in ("basic", "spec")}
    all3 = {t: (sum(all(v) for i, v in full.items() if tr[i] == t), sum(1 for i in full if tr[i] == t)) for t in ("basic", "spec")}
    flip = sum(1 for v in full.values() if len(set(v)) > 1)
    never = [i for i, v in full.items() if not any(v)]
    cap = [r for r in rs if r["max_turns_hit"] == "1"]
    inp = sum(int(r["input_tokens"] or 0) + int(r["cache_read_tokens"] or 0) + int(r["cache_creation_tokens"] or 0) for r in rs)
    out = sum(int(r["output_tokens"] or 0) for r in rs)
    q = [r for r in rs if r["tsc_new_errors"] != ""]
    print(f"| {s} | {m} | {len(rs)} | {res['basic']} | {res['spec']} | {all3['basic'][0]}/{all3['basic'][1]}, {all3['spec'][0]}/{all3['spec'][1]} | {flip} | {', '.join(sorted(never)) or '없음'} | "
          f"{med([num(r['num_turns']) for r in rs])} | {med([num(r['secs']) for r in rs])} | {round(sum(num(r['secs']) for r in rs)/3600, 1)} | {len(cap)} ({sum(r['resolved']=='1' for r in cap)}) | {sum(r['timed_out']=='1' for r in rs)} | "
          f"{inp:,} | {out:,} | {sum(int(r['tsc_new_errors']) for r in q)} | {sum(int(r['eslint_new_errors']) for r in q)} | {sum(int(r['format_new_violations']) for r in q)} | {med([num(r['diff_lines']) for r in q])} | {sum(int(r['added_comment_lines']) for r in q)} |")

print("\n## 격리 실행의 턴 수 분포 (Sonnet 5.5 대 GLM 5.3)")
for model in ("claude-sonnet-5-5", "glm-5.3"):
    c = Counter()
    for r in groups[("isolated", model)]:
        t = num(r["num_turns"])
        if r["max_turns_hit"] == "1":
            b = "limit"
        elif t is None:
            b = "none"
        elif t >= 60:
            b = "60+"
        else:
            b = f"{int(t)//10*10}-{int(t)//10*10+9}"
        c[(b, r["resolved"] == "1")] += 1
    print(model, {b: (c[(b, True)], c[(b, False)]) for b in ["0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60+", "limit"]})

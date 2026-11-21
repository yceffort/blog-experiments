#!/bin/sh
# 조건 전체를 3회 잰다. 기본 Chrome 과 LimitLayerMergeDistance:limit/16 을 켠 Chrome 을 각각 띄운다.
# CHROME 으로 실행 파일 경로를 바꿀 수 있다.
set -eu
cd "$(dirname "$0")"
CHROME=${CHROME:-"/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta"}
PAGE="file://$PWD/index.html"
mkdir -p results work

launch() {
  port=$1; shift
  "$CHROME" --remote-debugging-port="$port" --user-data-dir="$PWD/work/profile-$port" \
    --no-first-run --no-default-browser-check --disable-background-timer-throttling \
    --disable-renderer-backgrounding --disable-backgrounding-occluded-windows \
    --window-size=500,1000 "$@" about:blank >/dev/null 2>&1 &
  for _ in $(seq 1 40); do curl -s -m 1 "http://127.0.0.1:$port/json/version" >/dev/null && return; sleep 0.5; done
  echo "Chrome did not start on $port" >&2; exit 1
}
stop() { pkill -f "user-data-dir=$PWD/work/profile-$1" || true; sleep 1; }

DEFAULT="
z=1&k=0&n=200
z=1&k=16&n=200
z=1&k=32&n=200
z=1&k=48&n=200
z=auto&k=0&n=200
z=auto&k=16&n=200
z=auto&k=32&n=200
z=auto&k=48&n=200
z=0&k=32&n=200
z=201&k=32&n=200
z=1&k=32&n=200&clip=0
z=auto&k=32&n=200&clip=0
z=1&k=32&n=100&m=100
z=auto&k=32&n=100&m=100
z=1&k=32&n=100&m=100&fix=iso
z=1&k=32&n=100&m=100&fix=listwc
z=1&k=32&n=100&m=100&fix=iso,listwc
z=1&k=32&n=100&m=100&fix=cpaint
z=1&k=32&n=100&m=100&fix=secwc
z=1&k=32&n=200&fix=rowstatic
z=auto&k=32&n=200&fix=rowstatic
z=1&k=32&n=50
z=auto&k=32&n=50
z=1&k=32&n=100
z=auto&k=32&n=100
z=1&k=32&n=150
z=auto&k=32&n=150
z=1&k=32&n=200&trigger=anim
z=1&k=32&n=200&trigger=text
z=1&k=32&n=200&trigger=scroll
z=1&k=32&n=200&trigger=none
"
# DPR 1 에서는 클립이 없어도 줄이 청크로 나뉜다
DPR1="
z=1&k=32&n=200&clip=0
z=auto&k=32&n=200&clip=0
z=1&k=32&n=200&clip=0&fix=bblock
z=auto&k=32&n=200&clip=0&fix=bblock
"
LIMIT="
z=1&k=32&n=200
z=auto&k=32&n=200
z=1&k=48&n=200
"
LAYERS="
z=1&k=32&n=200
z=auto&k=32&n=200
z=1&k=32&n=100&m=100&fix=iso
z=1&k=32&n=100&m=100&fix=cpaint
"

: > results/timing.jsonl
: > results/layers.jsonl
for pass in 1 2 3; do
  # 패스마다 순서를 뒤집어 시간에 따른 흔들림이 한 조건에 몰리지 않게 한다
  if [ "$pass" = 2 ]; then order=$(echo "$DEFAULT" | sed '/^$/d' | tail -r); else order=$(echo "$DEFAULT" | sed '/^$/d'); fi
  launch 9222
  for q in $order; do PORT=9222 node measure.mjs "$PAGE?$q" | sed "s/^{/{\"build\":\"default\",\"pass\":$pass,/" >> results/timing.jsonl; done
  for q in $(echo "$DPR1" | sed '/^$/d'); do VIEWPORT='{"width":390,"height":844,"deviceScaleFactor":1,"mobile":true}' PORT=9222 node measure.mjs "$PAGE?$q" | sed "s/^{/{\"build\":\"dpr1\",\"pass\":$pass,/" >> results/timing.jsonl; done
  stop 9222
  launch 9223 --enable-features=LimitLayerMergeDistance:limit/16
  for q in $(echo "$LIMIT" | sed '/^$/d'); do PORT=9223 node measure.mjs "$PAGE?$q" | sed "s/^{/{\"build\":\"limit16\",\"pass\":$pass,/" >> results/timing.jsonl; done
  stop 9223
done

launch 9222
for q in $(echo "$LAYERS" | sed '/^$/d'); do PORT=9222 node layers.mjs "$PAGE?$q" | sed 's/^{/{"build":"default",/' >> results/layers.jsonl; done
stop 9222
launch 9223 --enable-features=LimitLayerMergeDistance:limit/16
for q in $(echo "$LIMIT" | sed '/^$/d'); do PORT=9223 node layers.mjs "$PAGE?$q" | sed 's/^{/{"build":"limit16",/' >> results/layers.jsonl; done
stop 9223

node summarize.mjs > results/summary.md
cat results/summary.md

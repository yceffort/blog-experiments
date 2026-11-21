#!/bin/sh
# static으로 바꿀 수 없는 줄의 대안과, 숫자 폭 고정 때의 Layout/Paint를 3회 잰다.
set -eu
cd "$(dirname "$0")"
CHROME=${CHROME:-"/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta"}
PAGE="file://$PWD/index.html"
PATTERN=${PATTERN:-"https://yceffort.kr/demos/sticky-z-index-layerize/pattern.html"}
mkdir -p results work
port=9224
EXTRA="
z=1&k=32&n=200
z=auto&k=32&n=200
z=1&k=32&n=200&fix=rowstatic
z=1&k=32&n=200&fix=gridbadge
z=auto&k=32&n=200&fix=gridbadge
z=1&k=32&n=200&fix=rowtf
z=auto&k=32&n=200&fix=rowtf
z=1&k=32&n=200&fix=rowop
z=auto&k=32&n=200&fix=rowop
z=1&k=32&n=200&fix=virt&v=30
z=auto&k=32&n=200&fix=virt&v=30
"
WIDTH="
auto=1&z=1&live=1
auto=1&z=1&live=same
auto=1&z=1&live=0
"
: > results/extra-timing.jsonl
: > results/extra-width.jsonl
for pass in 1 2 3; do
  if [ "$pass" = 2 ]; then order=$(echo "$EXTRA" | sed '/^$/d' | tail -r); else order=$(echo "$EXTRA" | sed '/^$/d'); fi
  "$CHROME" --remote-debugging-port=$port --user-data-dir="$PWD/work/profile-$port" \
    --no-first-run --no-default-browser-check --disable-background-timer-throttling \
    --disable-renderer-backgrounding --disable-backgrounding-occluded-windows \
    --window-size=500,1000 about:blank >/dev/null 2>&1 &
  for _ in $(seq 1 40); do curl -s -m 1 "http://127.0.0.1:$port/json/version" >/dev/null && break; sleep 0.5; done
  for q in $order; do PORT=$port node measure.mjs "$PAGE?$q" | sed "s/^{/{\"pass\":$pass,/" >> results/extra-timing.jsonl; done
  for q in $(echo "$WIDTH" | sed '/^$/d'); do PORT=$port node measure.mjs "$PATTERN?$q" | sed "s/^{/{\"pass\":$pass,/" >> results/extra-width.jsonl; done
  pkill -f "user-data-dir=$PWD/work/profile-$port" || true; sleep 1
done

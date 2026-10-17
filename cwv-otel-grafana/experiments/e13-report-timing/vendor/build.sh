#!/usr/bin/env bash
# web-vitals 를 태그나 커밋에서 빌드해 IIFE 번들을 이 폴더에 둔다.
# 6.2.3 과 4.2.1 빌드는 npm 배포본의 dist/web-vitals.iife.js 와 바이트 단위로 같았다(2026-10-17).
# 사용: bash vendor/build.sh   (e13-report-timing 에서)
set -euo pipefail
out="$(cd "$(dirname "$0")" && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
git clone -q https://github.com/GoogleChrome/web-vitals.git "$work/web-vitals"
for ref in v6.2.3 v4.2.1 e773747; do
  (cd "$work/web-vitals" && git checkout -q "$ref" && git clean -qfdx && npm ci --ignore-scripts --no-audit --no-fund >/dev/null && npm run -s build >/dev/null)
  cp "$work/web-vitals/dist/web-vitals.iife.js" "$out/web-vitals-$ref.iife.js"
  echo "web-vitals-$ref.iife.js"
done

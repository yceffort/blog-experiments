#!/bin/sh
# results/impact의 같은 실행 기록과 분석 파일을 coldpath 버전마다 다시 분석한다.
# fixtures/impact/next-app/.next(커밋하지 않은 10월 4일 빌드)가 있어야 한다. 실험 디렉터리에서 실행한다.
set -eu
root=$(pwd)
out=$root/results/coldpath-versions
tmp=$(mktemp -d)
mkdir -p "$out"
for v in 0.6.0 0.6.1 0.8.0 0.8.1 0.8.2; do
  npm install --prefix "$tmp/$v" --no-save --silent "@yceffort/coldpath@$v"
  bin=$tmp/$v/node_modules/.bin/coldpath
  "$bin" graph --format turbopack --input results/impact/modules.data --root "$root" --out "$out/graph.$v.json"
  (cd fixtures/impact/next-app && "$bin" --dir .next/static \
    --coverage "$root/results/impact/initial.coverage.json" \
    --coverage "$root/results/impact/click-cjs.coverage.json" \
    --initial-scenario initial --graph "$out/graph.$v.json" --graph-root "$root" \
    --json "$out/report.$v.json" >/dev/null)
done
node -e '
const fs = require("node:fs")
const summary = {}
for (const v of ["0.6.0", "0.6.1", "0.8.0", "0.8.1", "0.8.2"]) {
  const report = JSON.parse(fs.readFileSync(`${process.argv[1]}/report.${v}.json`, "utf8"))
  const r = report.recommendations.find((x) => x.source.endsWith("/heavy-cjs.js"))
  summary[v] = {
    kind: r.kind,
    initialObservedBytes: r.initialObservedBytes,
    initialTopLevelOnly: r.initialTopLevelOnly,
    edges: r.importPath.edges.map((e) => ({kind: e.kind, topLevel: e.topLevel, location: e.location})),
    explanation: r.explanation,
  }
}
fs.writeFileSync(`${process.argv[1]}/summary.json`, JSON.stringify(summary, null, 2) + "\n")
' "$out"
rm -rf "$tmp"

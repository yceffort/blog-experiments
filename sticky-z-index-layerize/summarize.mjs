// results/timing.jsonl 과 results/layers.jsonl 을 읽어 조건별 중앙값 표를 만든다.
import fs from 'node:fs';

const read = f => fs.readFileSync(new URL(f, import.meta.url), 'utf8').trim().split('\n').map(l => JSON.parse(l));
const timing = read('results/timing.jsonl');
const layers = read('results/layers.jsonl');
const median = xs => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

const groups = new Map();
for (const r of timing) {
  const key = `${r.build}\t${r.query}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(r);
}

console.log(`브라우저: ${timing[0].browser}\n`);
console.log('| 빌드 | 조건 | 전체 경로 횟수 | 1회 평균(ms) 중앙값 | 3회 값 |');
console.log('| --- | --- | --- | --- | --- |');
for (const [key, rs] of groups) {
  const [build, query] = key.split('\t');
  const v = rs.map(r => r.fullAvgMs);
  console.log(`| ${build} | \`${query}\` | ${rs.map(r => r.full).join('/')} | ${median(v).toFixed(2)} | ${v.map(x => x.toFixed(2)).join(' / ')} |`);
}

console.log('\n| 빌드 | 조건 | 레이어 수 | sticky 뒤 레이어 |');
console.log('| --- | --- | --- | --- |');
for (const r of layers) console.log(`| ${r.build} | \`${r.query}\` | ${r.count} | ${r.afterSticky.join('<br>')} |`);

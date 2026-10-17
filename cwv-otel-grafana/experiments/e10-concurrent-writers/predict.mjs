// run.mjs 와 같은 입력에 delta_to_cumulative 의 두 규칙만 도착 순서대로 적용해, 남는 건수를 계산한다.
// 사용: node e10-concurrent-writers/predict.mjs a b   (docker 불필요)
// 규칙(internal/delta/delta.go 의 Aggregate): 시작 시각이 시리즈의 시작 시각보다 이르면 ErrOlderStart,
// 시각이 지금까지 받은 가장 늦은 시각 이하면 ErrOutOfOrder 로 버린다.
import { SCENARIOS, events, mulberry32, seedOf, stamps } from './scenarios.mjs';

function predict(list) {
  let state;
  const out = { kept: 0, olderStart: 0, outOfOrder: 0 };
  for (const e of [...list].sort((x, y) => x.at + x.delay - (y.at + y.delay))) {
    const { time, start } = stamps(e);
    if (!state) {
      state = { start, time };
      out.kept++;
    } else if (start < state.start) out.olderStart++;
    else if (time <= state.time) out.outOfOrder++;
    else {
      state.time = time;
      out.kept++;
    }
  }
  return out;
}

for (const seed of process.argv.slice(2)) {
  for (const [scenario, specs] of Object.entries(SCENARIOS)) {
    for (const spec of specs) {
      const inputId = `e10-${scenario}-${spec.rate}-${seed}`;
      const list = events(spec, mulberry32(seedOf(inputId)));
      const { kept, olderStart, outOfOrder } = predict(list);
      console.log(`${inputId}: 보낸 ${list.length}건, 남음 ${kept}, ErrOlderStart ${olderStart}, ErrOutOfOrder ${outOfOrder}`);
    }
  }
}

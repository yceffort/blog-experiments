// number-flow와 배경 갱신은 서로 독립된 난수열을 사용한다.
// 모든 빌드와 반복 실행에 같은 입력을 전달하고 JSON으로 보관한다.
export const SEED = 0x20261101
export const UPDATE_COUNT = 10

const random = (seed) => () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
  return seed / 0x100000000
}

export function createInputs(scenario) {
  if (!['same', 'vary'].includes(scenario))
    throw new Error(`Unknown scenario: ${scenario}`)
  const number = random(SEED)
  const background = random(SEED ^ 0xabcdef01)
  const nine = () => (100_000_000 + Math.floor(number() * 900_000_000)) / 100
  const seven = () => (1_000_000 + Math.floor(number() * 9_000_000)) / 100
  return {
    seed: SEED,
    scenario,
    locale: 'en-US',
    initial: nine(),
    values: Array.from({length: UPDATE_COUNT}, (_, i) =>
      scenario === 'vary' && i % 2 === 0 ? seven() : nine(),
    ),
    background: Array.from({length: 2000}, () =>
      (background() * 100000).toFixed(2),
    ),
  }
}

// run.mjs 와 predict.mjs 가 같은 입력을 만들도록 시나리오와 난수 생성기를 한곳에 둔다.
export const MIN = 60_000;

// 2014년 하루 3억 페이지 로드에서 브라우저 Date() 와 서버 시각을 비교한 분포(5분 단위로 묶은 절댓값 백분위).
// 90% 는 5분 안, 99% 는 115분 안, 99.9% 는 1530분 안, 99.99% 는 76320분 안이고 앞선 쪽이 약 57% 다.
// 5분 안쪽은 공개되지 않아 0 으로 둔다. 구간 안의 균등 분포, 꼬리 고정, 부호와 크기의 독립도 모두 가정이다.
// 0 이 손실을 가장 줄인다는 보장은 없다(늦게 수집된 값도 시계가 조금 앞서면 살아남는다).
const BANDS = [[0.9, 0, 0], [0.99, 5, 115], [0.999, 115, 1530], [0.9999, 1530, 76320], [1, 76320, 76320]];
function skew2014(rand) {
  const p = rand();
  const [, lo, hi] = BANDS.find(([q]) => p < q);
  return (rand() < 0.57 ? 1 : -1) * (lo + (hi - lo) * rand()) * MIN;
}

export const SCENARIOS = {
  jitter: [1, 10, 50].map((rate) => ({ rate, seconds: 60 })),
  'one-fast': [{ rate: 2, seconds: 120, inject: { at: 20_000, skew: MIN } }],
  'far-future': [{ rate: 1, seconds: 420, inject: { at: 10_000, skew: 120 * MIN } }],
  skew2014: [1, 10].map((rate) => ({ rate, seconds: 120, skew: skew2014 })),
};

export function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32;
  };
}
export const seedOf = (s) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);

// 보내는 시각과 시작 시각(ms). run.mjs 는 이 값을 정수 ms 로 직렬화하고 predict.mjs 는 이 값으로 비교한다.
export const stamps = ({ at, skew, interval }) => ({ time: Math.round(at + skew), start: Math.round(at + skew - interval) });

// 페이지 로드마다 수집 시각(at), 시계 편차, 네트워크 지연, 직전 수집과의 간격을 정한다.
export function events({ rate, seconds, inject, skew = () => 0 }, rand) {
  const list = [];
  for (let at = 0; ; ) {
    at += (-Math.log(1 - rand()) / rate) * 1000;
    if (at >= seconds * 1000) break;
    list.push({ at, skew: skew(rand), delay: 50 + 500 * rand(), interval: 10_000 * rand() });
  }
  if (inject) list.push({ ...inject, delay: 50 + 500 * rand(), interval: 10_000 * rand() });
  return list;
}

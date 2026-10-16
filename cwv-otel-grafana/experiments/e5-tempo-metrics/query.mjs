// send.mjs 를 충분히(60분 넘게) 돌린 뒤 실행한다. 네 Tempo 에 같은 TraceQL metrics 쿼리를 보내 구간별 결과를 비교한다.
const TEMPOS = {
  'tempo 3.1.0': 'http://localhost:3200',
  'tempo 2.10.8 default': 'http://localhost:33201',
  'tempo 2.10.8 noflush': 'http://localhost:33202',
  'tempo 2.10.8 flush': 'http://localhost:33203',
};
const minutes = Number(process.argv[2] ?? 60);
// Tempo 3.1.0 은 끝이 step 배수가 아니면 마지막 구간을 빼므로 5분 배수로 맞춘다.
const end = Math.floor(Date.now() / 1000 / 300) * 300;
const start = end - minutes * 60;
const BASE = '{resource.service.name="lab-e5" && name="e5.value"}';
const QUERIES = {
  count: `${BASE} | count_over_time()`,
  p75: `${BASE} | quantile_over_time(duration, .75)`,
  p75_attr: `${BASE} | quantile_over_time(span.e5.value_ms, .75)`,
};

for (const [label, url] of Object.entries(TEMPOS)) {
  for (const [name, q] of Object.entries(QUERIES)) {
    const params = new URLSearchParams({ q, start: String(start), end: String(end), step: '300s' });
    const res = await fetch(`${url}/api/metrics/query_range?${params}`);
    const text = await res.text();
    if (!res.ok) {
      console.log(`${label} | ${name} | HTTP ${res.status} ${text.slice(0, 160)}`);
      continue;
    }
    const body = JSON.parse(text);
    const samples = (body.series ?? []).flatMap((s) => s.samples ?? []);
    // 5분 구간마다 값. 값 필드가 없으면 0 이다(protobuf JSON 이 0 을 생략한다).
    const byStep = samples
      .map((p) => [Math.round((Number(p.timestampMs) / 1000 - start) / 60), Number((p.value ?? 0).toFixed(3))])
      .sort((a, b) => a[0] - b[0]);
    console.log(`${label} | ${name} | ${byStep.map(([m, v]) => `${m}m:${v}`).join(' ')}`);
  }
}

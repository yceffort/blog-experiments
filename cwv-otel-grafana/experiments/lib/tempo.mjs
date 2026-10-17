const TEMPO = process.env.TEMPO_URL ?? 'http://localhost:3200';

/** TraceQL 로 찾은 trace 수. start, end 는 unix 초. tail sampling 의 decision_wait(15초)를 지나야 Tempo 에 들어온다. */
export async function traceCount(traceql, start, end) {
  const params = new URLSearchParams({ q: traceql, start: String(start), end: String(end), limit: '1000', spss: '1' });
  const res = await fetch(`${TEMPO}/api/search?${params}`);
  if (!res.ok) throw new Error(`tempo ${res.status}: ${await res.text()}`);
  const body = await res.json();
  return (body.traces ?? []).length;
}

/** demo-web 의 페이지 trace 중 지표별 span 이 있는 trace 수. */
export async function spanCounts(start, end) {
  const names = ['TTFB', 'FCP', 'LCP', 'INP', 'CLS'];
  const entries = await Promise.all(
    names.map(async (name) => [name, await traceCount(`{ resource.service.name = "demo-web" && name = "cwv.${name.toLowerCase()}" }`, start, end)]),
  );
  return Object.fromEntries(entries);
}

const MIMIR = process.env.MIMIR_URL ?? 'http://localhost:9009/prometheus';
const TENANT = process.env.MIMIR_TENANT ?? 'demo';

export async function query(promql, time) {
  const params = new URLSearchParams({ query: promql });
  if (time) params.set('time', String(time));
  const res = await fetch(`${MIMIR}/api/v1/query?${params}`, { headers: { 'X-Scope-OrgID': TENANT } });
  const body = await res.json();
  if (body.status !== 'success') throw new Error(`${promql}: ${body.error}`);
  return body.data.result;
}

/** 지표별 누적 건수. 시리즈가 없으면 0 이다. */
export async function counts() {
  const names = { TTFB: 'cwv_ttfb_milliseconds_count', FCP: 'cwv_fcp_milliseconds_count', LCP: 'cwv_lcp_milliseconds_count', INP: 'cwv_inp_milliseconds_count', CLS: 'cwv_cls_count' };
  const entries = await Promise.all(
    Object.entries(names).map(async ([metric, series]) => {
      const result = await query(`sum(${series})`);
      return [metric, result.length ? Number(result[0].value[1]) : 0];
    }),
  );
  return Object.fromEntries(entries);
}

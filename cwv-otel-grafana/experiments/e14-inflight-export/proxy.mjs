// collector 앞에 두는 프록시. 요청을 그대로 collector 에 넘기고, 다음 /v1/metrics 응답만 정해진 시간만큼 늦춘다.
// 브라우저 쪽 요청의 시각, 크기, 담긴 지표 이름을 기록한다. CORS 는 프록시가 처리한다(collector 는 5173 만 허용).
import http from 'node:http';

function namesIn(path, body) {
  try {
    const json = JSON.parse(body);
    if (path === '/v1/metrics') {
      return json.resourceMetrics.flatMap((r) => r.scopeMetrics.flatMap((s) => s.metrics.map((m) => m.name)));
    }
    return json.resourceSpans.flatMap((r) => r.scopeSpans.flatMap((s) => s.spans.map((x) => x.name)));
  } catch {
    return [];
  }
}

export function startProxy({ port, target }) {
  let entries = [];
  let delayNextMetrics = 0;
  let waiters = [];

  const server = http.createServer((req, res) => {
    res.setHeader('access-control-allow-origin', req.headers.origin ?? '*');
    res.setHeader('access-control-allow-headers', 'content-type');
    res.setHeader('access-control-max-age', '0');
    if (req.method === 'OPTIONS') return res.writeHead(204).end();

    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', async () => {
      const body = Buffer.concat(chunks);
      const entry = { at: Date.now(), path: req.url, bytes: body.length, names: namesIn(req.url, body.toString()) };
      if (req.url === '/v1/metrics' && delayNextMetrics > 0) {
        entry.delayed = delayNextMetrics;
        delayNextMetrics = 0;
      }
      entries.push(entry);
      const pending = waiters.filter((w) => w.path === req.url);
      waiters = waiters.filter((w) => w.path !== req.url);
      for (const { resolve } of pending) resolve(entry);

      let status = 502;
      try {
        const upstream = await fetch(`${target}${req.url}`, {
          method: 'POST',
          headers: { 'content-type': req.headers['content-type'] ?? 'application/json' },
          body,
        });
        status = upstream.status;
      } catch {}
      entry.status = status;
      if (entry.delayed) await new Promise((resolve) => setTimeout(resolve, entry.delayed));
      entry.respondedAt = Date.now();
      res.writeHead(status).end();
    });
  });
  server.listen(port);

  return {
    reset(delay) {
      entries = [];
      waiters = [];
      delayNextMetrics = delay;
    },
    waitFor(path) {
      return new Promise((resolve) => waiters.push({ path, resolve }));
    },
    entries: () => entries,
    close: () => server.close(),
  };
}

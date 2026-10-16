// 페이지(4400)와 가짜 collector(4401)를 띄운다. collector 는 경로로 응답을 고른다.
//   /ok/...      200, CORS 허용
//   /bad/...     400, CORS 허용
//   /nocors/...  200, CORS 헤더 없음(preflight 도 거부)
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';

export const received = new Map();
const PAGE_ORIGIN = 'http://localhost:4400';

export function start() {
  const page = createServer((req, res) => {
    if (req.url === '/bundle.js') {
      res.writeHead(200, { 'content-type': 'text/javascript' });
      res.end(readFileSync(new URL('./dist/bundle.js', import.meta.url)));
      return;
    }
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end('<!doctype html><title>e2</title><script src="/bundle.js"></script>');
  }).listen(4400);

  const collector = createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const mode = url.pathname.split('/')[1];
    const cors = mode === 'nocors' ? {} : {
      'access-control-allow-origin': PAGE_ORIGIN,
      'access-control-allow-methods': 'POST',
      'access-control-allow-headers': 'content-type',
      'access-control-allow-credentials': 'true',
    };
    if (req.method === 'OPTIONS') {
      res.writeHead(mode === 'nocors' ? 403 : 204, cors);
      res.end();
      return;
    }
    req.resume();
    req.on('end', () => {
      const key = url.searchParams.get('case');
      received.set(key, (received.get(key) ?? 0) + 1);
      res.writeHead(mode === 'bad' ? 400 : 200, { 'content-type': 'application/json', ...cors });
      res.end(mode === 'bad' ? '{"message":"bad request"}' : '{}');
    });
  }).listen(4401);

  return () => { page.close(); collector.close(); };
}

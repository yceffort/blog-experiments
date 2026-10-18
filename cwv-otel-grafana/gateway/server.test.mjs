import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

// server.mjs 를 실제로 띄워 collector 가 응답하지 않을 때의 저장과 종료를 본다. 포트는 E11(34360)과 겹치지 않게 둔다.
const SERVER = new URL('./server.mjs', import.meta.url).pathname;
const EXPORT_MS = 200;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let nextPort = 34390;

async function startGateway(otlpUrl) {
  const port = nextPort++;
  const stateFile = join(mkdtempSync(join(tmpdir(), 'gateway-test-')), 'state.json');
  const child = spawn(process.execPath, [SERVER], {
    env: { ...process.env, PORT: String(port), FINALIZE_MS: '0', EXPORT_MS: String(EXPORT_MS), OTLP_URL: otlpUrl, STATE_FILE: stateFile },
    stdio: 'ignore',
  });
  const url = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 50; i++) {
    if (await fetch(`${url}/stats`).then((r) => r.ok, () => false)) return { child, url, stateFile };
    await wait(100);
  }
  child.kill('SIGKILL');
  throw new Error('gateway not ready');
}
const post = (url, reports) => fetch(`${url}/v1/vitals`, { method: 'POST', body: JSON.stringify(reports) });
const readState = (file) => JSON.parse(readFileSync(file, 'utf8'));
const exited = (child) => new Promise((r) => child.once('exit', r));

describe('server.mjs 와 응답하지 않는 collector', () => {
  it('collector 에 닿지 못해도 확정 key 와 unsent 표본을 저장한다', async () => {
    // 포트 1 은 닫혀 있어 연결이 바로 거절된다
    const { child, url, stateFile } = await startGateway('http://127.0.0.1:1/v1/metrics');
    try {
      await post(url, [{ key: 'd1:0:LCP', revision: 1, name: 'LCP', value: 1800, labels: { rating: 'good' } }]);
      await wait(EXPORT_MS * 3);

      const state = readState(stateFile);
      assert.deepEqual(state.finalized.map(([key]) => key), ['d1:0:LCP']);
      assert.deepEqual(state.unsent.map((m) => [m.key, m.value]), [['d1:0:LCP', 1800]]);
    } finally {
      child.kill('SIGKILL');
      await exited(child);
    }
  });

  it('응답이 없는 collector 를 기다리지 않고 SIGTERM 에 끝나며, 끝나기 전에 저장한다', async () => {
    const silent = createServer(() => {}); // 요청을 받고 응답하지 않는다
    await new Promise((r) => silent.listen(0, '127.0.0.1', r));
    const { child, url, stateFile } = await startGateway(`http://127.0.0.1:${silent.address().port}/v1/metrics`);
    try {
      await post(url, [{ key: 'd2:0:CLS', revision: 1, name: 'CLS', value: 0.2, labels: {} }]);
      await wait(EXPORT_MS * 2);

      const started = Date.now();
      child.kill('SIGTERM');
      const code = await exited(child);
      const took = Date.now() - started;
      assert.equal(code, 0);
      assert.ok(took < EXPORT_MS * 10, `종료까지 ${took}ms`);
      assert.deepEqual(readState(stateFile).finalized.map(([key]) => key), ['d2:0:CLS']);
    } finally {
      child.kill('SIGKILL');
      silent.closeAllConnections();
      silent.close();
    }
  });
});

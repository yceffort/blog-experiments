// 두 버전의 브라우저 exporter 가 collector 실패를 어떻게 보고하는지 본다.
// 사용: node e2-exporter/run.mjs
import { execFileSync } from 'node:child_process';

import { chromium } from 'playwright';

import { received, start } from './server.mjs';

execFileSync('npx', ['esbuild', `${import.meta.dirname}/entry.js`, '--bundle', '--format=iife', `--outfile=${import.meta.dirname}/dist/bundle.js`, '--log-level=warning']);
const stop = start();

const VARIANTS = [
  ['1.30.1 headers 없음', 1, undefined],
  ['1.30.1 headers {}', 1, {}],
  ['2.12.0 기본', 2, undefined],
];
const MODES = ['ok', 'bad', 'nocors'];

const browser = await chromium.launch();
console.log('chromium', browser.version());
for (let run = 1; run <= 2; run += 1) {
  received.clear();
  const page = await browser.newPage();
  await page.goto('http://localhost:4400/');
  for (const [label, version, headers] of VARIANTS) {
    for (const mode of MODES) {
      const key = `${version}-${headers ? 'h' : 'n'}-${mode}-${run}`;
      const url = `http://localhost:4401/${mode}/v1/traces?case=${key}`;
      const out = await page.evaluate(([v, u, h]) => window.exportOnce(v, u, h), [version, url, headers]);
      await new Promise((r) => setTimeout(r, 300));
      console.log(`run ${run} | ${label} | ${mode} | ${out.result} | ${out.transport.join(' ')} | server ${received.get(key) ?? 0}건 | ${out.ms}ms`);
    }
  }
  await page.close();
}
await browser.close();
stop();

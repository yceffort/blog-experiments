import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MetricWithAttribution } from 'web-vitals/attribution';

import { createGatewaySender } from '../src/telemetry/gateway';

const metric = (name: string, id: string, value: number, navigationStartTime = 0) =>
  ({ name, id, value, navigationStartTime, navigationType: 'navigate', rating: 'good', attribution: {} }) as MetricWithAttribution;
const tick = () => new Promise((resolve) => setTimeout(resolve));

describe('createGatewaySender', () => {
  const fetch = vi.fn<typeof globalThis.fetch>(() => Promise.resolve(new Response()));
  beforeEach(() => vi.stubGlobal('fetch', fetch));
  afterEach(() => {
    vi.unstubAllGlobals();
    fetch.mockClear();
  });
  const sent = () => fetch.mock.calls.flatMap(([, init]) => JSON.parse(init!.body as string));

  it('같은 측정의 갱신은 같은 key 로 revision 을 올려 보낸다', async () => {
    const send = createGatewaySender('http://gw/v1/vitals', 'home');
    send(metric('CLS', 'v1', 0.01), false);
    await tick();
    send(metric('CLS', 'v1', 0.4), false);
    await tick();

    const [first, second] = sent();
    expect(second.key).toBe(first.key);
    expect([first.revision, first.value, second.revision, second.value]).toEqual([1, 0.01, 2, 0.4]);
    expect(first.labels).toEqual({ 'page.route': 'home', 'navigation.type': 'navigate', rating: 'good' });
  });

  it('LCP 의 잠정값과 정식 값은 web-vitals id 가 달라도 같은 측정이고, bfcache 복원은 다른 측정이다', async () => {
    const send = createGatewaySender('http://gw/v1/vitals', 'home');
    send(metric('LCP', 'candidate-observer', 800), true);
    send(metric('LCP', 'final-observer', 6000), false);
    send(metric('LCP', 'restore', 40, 5000), false);
    await tick();

    const [quiet, final, restore] = sent();
    expect([quiet.provisional, final.provisional]).toEqual([true, false]);
    expect(final.key).toBe(quiet.key);
    expect(final.revision).toBe(2);
    expect(restore.key).not.toBe(final.key);
  });

  it('같은 tick 의 보고는 keepalive 요청 하나로 보내고, 문자열 본문이라 preflight 가 없다', async () => {
    const send = createGatewaySender('http://gw/v1/vitals', 'home');
    send(metric('CLS', 'v1', 0.01), false);
    send(metric('INP', 'v2', 120), false);
    await tick();

    expect(fetch).toHaveBeenCalledOnce();
    const [url, init] = fetch.mock.calls[0];
    expect([url, init!.method, init!.keepalive, typeof init!.body, init!.headers]).toEqual(['http://gw/v1/vitals', 'POST', true, 'string', undefined]);
    expect(sent()).toHaveLength(2);
  });
});

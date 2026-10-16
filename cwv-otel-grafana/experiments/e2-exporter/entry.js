// 브라우저에 올릴 번들. 두 버전의 OTLP trace exporter 로 span 하나를 내보내고 결과를 돌려준다.
import { BasicTracerProvider as Provider1, InMemorySpanExporter as Memory1, SimpleSpanProcessor as Simple1 } from 'otel1-sdk-trace-base';
import { OTLPTraceExporter as Exporter1 } from 'otel1-exporter-trace';
import { BasicTracerProvider as Provider2, InMemorySpanExporter as Memory2, SimpleSpanProcessor as Simple2 } from 'otel2-sdk-trace-base';
import { OTLPTraceExporter as Exporter2 } from 'otel2-exporter-trace';

const used = [];
const beacon = navigator.sendBeacon.bind(navigator);
navigator.sendBeacon = (...args) => {
  const queued = beacon(...args);
  used.push(`sendBeacon(queued=${queued})`);
  return queued;
};
const fetchOriginal = window.fetch;
window.fetch = (input, init) => {
  used.push(`fetch(keepalive=${init?.keepalive})`);
  return fetchOriginal(input, init);
};
const xhrSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function (...args) {
  used.push('xhr');
  return xhrSend.apply(this, args);
};

function finishedSpans(version) {
  const memory = version === 1 ? new Memory1() : new Memory2();
  const provider =
    version === 1
      ? (() => { const p = new Provider1(); p.addSpanProcessor(new Simple1(memory)); return p; })()
      : new Provider2({ spanProcessors: [new Simple2(memory)] });
  provider.getTracer('e2').startSpan('cwv.fcp').end();
  return memory.getFinishedSpans();
}

window.exportOnce = (version, url, headers) =>
  new Promise((resolve) => {
    used.length = 0;
    const exporter = version === 1 ? new Exporter1({ url, headers }) : new Exporter2({ url, headers });
    const started = performance.now();
    exporter.export(finishedSpans(version), (result) => {
      resolve({
        result: result.code === 0 ? 'success' : `failed(${result.error?.message ?? ''})`,
        transport: [...used],
        ms: Math.round(performance.now() - started),
      });
    });
  });

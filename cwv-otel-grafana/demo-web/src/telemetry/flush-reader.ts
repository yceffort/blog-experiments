import { MetricReader, type PushMetricExporter } from '@opentelemetry/sdk-metrics';

/**
 * forceFlush 할 때만 collect 하고 export 한다. 주기 export 는 없다. 블로그 운영본의
 * `apps/blog/src/utils/telemetry/flush-reader.ts` 와 같다(experiments/e15).
 *
 * PeriodicExportingMetricReader(sdk-metrics 2.9.0 부터)의 forceFlush 는 진행 중인 export 의 응답을
 * 기다린 뒤에 collect 한다. 어떤 export 가 나가 있는 동안 떠나면 막 기록한 CLS, INP 는 그 응답이
 * 올 때까지 collect 되지 않고, 그 사이 문서가 사라지면 나가지 못한다. 이 reader 는 앞선 export 를
 * 기다리지 않는다. delta 라서 collect 가 겹쳐도 같은 값을 두 번 보내지 않는다.
 */
export class FlushOnlyMetricReader extends MetricReader {
  constructor(private readonly exporter: PushMetricExporter) {
    super({
      aggregationSelector: exporter.selectAggregation?.bind(exporter),
      aggregationTemporalitySelector: exporter.selectAggregationTemporality?.bind(exporter),
    });
  }

  protected async onForceFlush(): Promise<void> {
    const { resourceMetrics } = await this.collect();
    if (resourceMetrics.scopeMetrics.length === 0) return;
    await new Promise<void>((resolve) => this.exporter.export(resourceMetrics, () => resolve()));
  }

  protected async onShutdown(): Promise<void> {
    await this.exporter.shutdown();
  }
}

import { Injectable } from '@nestjs/common';
import { Counter, Histogram } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly httpRequestsCounter: Counter<string>,
    @InjectMetric('http_request_duration_seconds')
    private readonly httpRequestDuration: Histogram<string>,
  ) {}

  incrementHttpRequests(method: string, path: string, statusCode: number) {
    this.httpRequestsCounter.inc({
      method,
      path,
      status: statusCode.toString(),
    });
  }

  observeHttpRequestDuration(method: string, path: string, duration: number) {
    this.httpRequestDuration.observe({ method, path }, duration);
  }
}

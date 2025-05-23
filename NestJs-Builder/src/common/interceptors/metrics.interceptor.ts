import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from '../extraModules/services/metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: response => {
          const duration = (Date.now() - startTime) / 1000; // Convert to seconds
          const statusCode = response?.statusCode || 200;

          this.metricsService.incrementHttpRequests(method, path, statusCode);
          this.metricsService.observeHttpRequestDuration(
            method,
            path,
            duration,
          );
        },
        error: error => {
          const duration = (Date.now() - startTime) / 1000;
          const statusCode = error?.status || 500;

          this.metricsService.incrementHttpRequests(method, path, statusCode);
          this.metricsService.observeHttpRequestDuration(
            method,
            path,
            duration,
          );
        },
      }),
    );
  }
}

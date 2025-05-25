import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '../services/logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const now = Date.now();

    // Log incoming request
    this.logger.http(
      `➡️ Incoming ${method} ${url} from ${ip}`,
      'LoggerInterceptor',
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const responseTime = Date.now() - now;

          // Log response
          this.logger.http(
            `⬅️ ${method} ${url} ${statusCode} ${responseTime}ms - ${ip}`,
            'LoggerInterceptor',
          );
        },
        error: (error: any) => {
          const responseTime = Date.now() - now;
          this.logger.error(
            `❌ ${method} ${url} - ${responseTime}ms - ${ip}`,
            error.stack,
            'LoggerInterceptor',
          );
        },
      }),
    );
  }
}

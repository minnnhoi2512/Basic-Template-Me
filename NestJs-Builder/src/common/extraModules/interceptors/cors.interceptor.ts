import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import 'dotenv/config';

@Injectable()
export class CorsInterceptor implements NestInterceptor {
  private readonly allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const origin = request.headers.origin;

    // Check if the request origin is in our allowed list
    if (this.allowedOrigins.includes(origin)) {
      response.header('Access-Control-Allow-Origin', origin);
      response.header(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      );
      response.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Accept, Authorization',
      );
      response.header('Access-Control-Allow-Credentials', 'true');
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      response.status(HttpStatus.NO_CONTENT).end();
      return new Observable(subscriber => {
        subscriber.complete();
      });
    }

    return next.handle();
  }
}

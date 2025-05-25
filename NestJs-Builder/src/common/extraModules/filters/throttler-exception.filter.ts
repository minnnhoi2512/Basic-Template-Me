import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest();
    const location = request.query['location'] || 'en';
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      status: false,
      location,
      message:
        location === 'en' ? 'Request too many time' : 'Yêu cầu quá nhiều',
      error:
        location === 'en'
          ? 'ThrottlerException: Too Many Requests"'
          : 'Yêu cầu quá nhiều',
    });
  }
}

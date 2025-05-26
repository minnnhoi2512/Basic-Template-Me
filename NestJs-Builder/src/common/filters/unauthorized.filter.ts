import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const location = request.query['location'] || 'en';

    response.status(status).json({
      status: false,
      location: location,
      message:
        location === 'en' ? 'Unauthorized access' : 'Truy cập không hợp lệ',
      error:
        location === 'en'
          ? 'UnauthorizedException: Unauthorized access'
          : 'Truy cập không hợp lệ',
    });
  }
}

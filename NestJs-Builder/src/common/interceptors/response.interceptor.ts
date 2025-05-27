import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, map, catchError, throwError } from 'rxjs';
import { CustomResponse } from '../../shared/responseType/response.dto';
import { messages } from 'src/shared/constants/messageResponse';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, CustomResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CustomResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const location = request.query['location'] || 'en';

    if (location !== 'en' && location !== 'vi') {
      return throwError(() => {
        throw new HttpException(
          new CustomResponse(
            false,
            location,
            'Invalid URL',
            undefined,
            'Invalid URL',
          ),
          HttpStatus.BAD_REQUEST,
        );
      });
    }

    const method = request.method;
    const path = request.route?.path || '';
    const operation = this.getOperationType(method, path);

    return next.handle().pipe(
      map(data => {
        const message = getLocalizedMessage(operation, location, true);
        return new CustomResponse(true, location, message, data);
      }),
      catchError(error => {
        const message = getLocalizedMessage(operation, location, false);
        let errorMessage = error.message;
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

        if (error instanceof HttpException) {
          statusCode = error.getStatus();
          const response = error.getResponse();
          errorMessage =
            typeof response === 'string' ? response : response['message'];
        }

        const response = new CustomResponse(
          false,
          location,
          message,
          undefined,
          errorMessage,
        );

        return throwError(() => {
          throw new HttpException(response, statusCode);
        });
      }),
    );
  }

  private getOperationType(method: string, path: string): string {
    const resource = path.split('/')[1] || 'resource';
    switch (method) {
      case 'GET':
        return path.includes(':id')
          ? `get_${resource}_detail`
          : `get_${resource}_list`;
      case 'POST':
        return `create_${resource}`;
      case 'PUT':
      case 'PATCH':
        return `update_${resource}`;
      case 'DELETE':
        return `delete_${resource}`;
      default:
        return 'operation';
    }
  }
}

function getLocalizedMessage(
  operation: string,
  location: string,
  isSuccess: boolean,
): string {
  return (
    messages[location]?.[operation]?.[isSuccess ? 'success' : 'error'] ||
    messages['en'][operation]?.[isSuccess ? 'success' : 'error'] ||
    (isSuccess ? 'Success' : 'Error')
  );
}

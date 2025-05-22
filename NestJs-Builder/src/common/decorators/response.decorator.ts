import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiGatewayTimeoutResponse,
  ApiConflictResponse,
  ApiTooManyRequestsResponse,
  ApiNoContentResponse,
  ApiServiceUnavailableResponse,
  ApiResponse,
  ApiBearerAuth,
  ApiBasicAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import 'dotenv/config';

export function CommonApiResponses(data: {
  dto: any;
  dtoName: string;
  summary: string;
  description: string;
}) {
  const decorators = [
    ApiOperation({ summary: data.summary, description: data.description }),
    ApiOkResponse({
      description: `The ${data.dtoName} was returned successfully`,
      type: data.dto,
    }),
    ApiCreatedResponse({
      description: `The ${data.dtoName} was created successfully`,
      type: data.dto,
    }),
    ApiNoContentResponse({ description: 'No content' }),
    ApiBadRequestResponse({ description: 'Bad request' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiResponse({
      status: 402,
      description: 'Token expired',
    }),
    ApiForbiddenResponse({ description: 'Forbidden' }),
    ApiNotFoundResponse({ description: 'Not found' }),
    ApiConflictResponse({ description: 'Conflict' }),
    ApiTooManyRequestsResponse({ description: 'Too many requests' }),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
    ApiServiceUnavailableResponse({ description: 'Service unavailable' }),
    ApiGatewayTimeoutResponse({ description: 'Gateway timeout' }),
  ];
  switch (process.env.AUTH_SYSTEM_TYPE) {
    case 'BEARER':
      decorators.push(ApiBearerAuth());
      break;
    case 'BASIC':
      decorators.push(ApiBasicAuth());
      break;
    case 'COOKIE':
      decorators.push(ApiCookieAuth());
      break;
    default:
      decorators.push(ApiBearerAuth());
      break;
  }
  return applyDecorators(...decorators);
}

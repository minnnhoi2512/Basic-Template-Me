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
  dto?: any; // Make dto optional to handle cases where no DTO is provided
  dtoName: string;
  summary: string;
  description: string;
}) {
  const successExample = {
    status: true,
    location: 'en',
    message: `Successfully ${data.summary.toLowerCase()}`,
    data: data.dto
      ? { $ref: `#/components/schemas/${data.dtoName}` }
      : undefined, // Provide empty object instead of instantiating
  };

  const errorExample = {
    status: false,
    location: 'en',
    message: `Failed to ${data.summary.toLowerCase()}`,
    error: 'Detail error message here',
  };

  const decorators = [
    ApiOperation({ summary: data.summary, description: data.description }),
    ApiOkResponse({
      description: `The ${data.dtoName} was returned successfully`,
      content: {
        'application/json': {
          example: successExample,
        },
      },
    }),
    ApiCreatedResponse({
      description: `The ${data.dtoName} was created successfully`,
      content: {
        'application/json': {
          example: successExample,
        },
      },
    }),
    ApiNoContentResponse({ description: 'No content' }),
    ApiBadRequestResponse({
      description: 'Bad request',
      content: {
        'application/json': {
          example: errorExample,
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      content: {
        'application/json': {
          example: errorExample,
        },
      },
    }),
    ApiResponse({
      status: 402,
      description: 'Token expired',
      content: {
        'application/json': {
          example: errorExample,
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      content: {
        'application/json': {
          example: errorExample,
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Not found',
      content: {
        'application/json': {
          example: errorExample,
        },
      },
    }),
    ApiConflictResponse({
      description: 'Conflict',
      content: {
        'application/json': {
          example: errorExample,
        },
      },
    }),
    ApiTooManyRequestsResponse({
      description: 'Too many requests',
      content: {
        'application/json': {
          example: errorExample,
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      content: {
        'application/json': {
          example: errorExample,
        },
      },
    }),
    ApiServiceUnavailableResponse({
      description: 'Service unavailable',
      content: {
        'application/json': {
          example: errorExample,
        },
      },
    }),
    ApiGatewayTimeoutResponse({
      description: 'Gateway timeout',
      content: {
        'application/json': {
          example: errorExample,
        },
      },
    }),
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

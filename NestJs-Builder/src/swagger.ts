import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(
  app: INestApplication,
  authSystemType: string = 'BEARER',
) {
  const config = new DocumentBuilder()
    .setTitle('NestJs Builder')
    .setDescription('The NestJs Builder API description')
    .setVersion('1.0');
  switch (authSystemType) {
    case 'BEARER':
      config.addBearerAuth();
      break;
    case 'BASIC':
      config.addBasicAuth();
      break;
    case 'COOKIE':
      config.addApiKey(
        {
          type: 'apiKey',
          in: 'cookie',
          name: 'session',
        },
        'cookie-auth',
      );
      break;
    default:
      config.addBearerAuth();
      break;
  }

  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('', app, document);
}

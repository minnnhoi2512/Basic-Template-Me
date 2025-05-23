import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { setupSwagger } from './swagger';
import { AuthService } from './auth/auth.service';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());

  const authService = app.get(AuthService);
  const port = authService.getPort();

  setupSwagger(app, authService.getAuth());

  await app.listen(port || 9999);
}
bootstrap();

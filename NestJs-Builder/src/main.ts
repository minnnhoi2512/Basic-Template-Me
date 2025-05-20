import { NestFactory } from '@nestjs/core';
import { UsersModule } from './modules/users/users.module';
import { setupSwagger } from './common/config/config.swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

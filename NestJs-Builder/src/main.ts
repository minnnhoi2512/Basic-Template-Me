import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { setupSwagger } from './swagger';
import { ResponseInterceptor } from './common/extraModules/interceptors/response.interceptor';
import { LoggerInterceptor } from './common/extraModules/interceptors/logger.interceptor';
import { MetricsInterceptor } from './common/extraModules/interceptors/metrics.interceptor';
import { Logger } from './common/extraModules/services/logger.service';
import { LoggerModule } from './common/extraModules/modules/logger.module';
import { MetricsModule } from './common/extraModules/modules/metrics.module';
import { MetricsService } from './common/extraModules/services/metrics.service';
import { UnauthorizedExceptionFilter } from './common/extraModules/filters/unauthorized.filter';
import * as os from 'os';
import 'dotenv/config';

const port = process.env.PORT || 9999;
const mode = process.env.NODE_ENV || 'development';
const auth = process.env.AUTH || 'BEARER';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  // Import logger and metrics modules
  app.select(LoggerModule);
  app.select(MetricsModule);

  const metricsService = app.select(MetricsModule).get(MetricsService);

  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new LoggerInterceptor(logger),
    new MetricsInterceptor(metricsService),
  );

  // Add global filters
  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  setupSwagger(app, auth);

  // Enable graceful shutdown
  const signals = ['SIGTERM', 'SIGINT'];
  signals.forEach(signal => {
    process.on(signal, () => {
      logger.info(`Received ${signal}, starting graceful shutdown`);
      app
        .close()
        .then(() => {
          logger.info('Application closed successfully');
          process.exit(0);
        })
        .catch(error => {
          logger.error('Error during graceful shutdown', error.stack);
          process.exit(1);
        });
    });
  });

  await app.listen(port);
  logger.info(`Application is running on: ${await app.getUrl()}`);
}

async function startCluster() {
  const logger = new Logger();

  const cluster = (await import('cluster')) as any;

  if (cluster.isPrimary && mode === 'production') {
    const numCPUs = os.cpus().length;
    logger.info(`Primary ${process.pid} is running`);
    logger.info(`Forking for ${numCPUs} CPUs`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      logger.warn(
        `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`,
      );
      logger.info('Starting a new worker');
      cluster.fork();
    });
  } else {
    logger.info(`Worker ${process.pid} started`);
    bootstrap();
  }
}

startCluster();

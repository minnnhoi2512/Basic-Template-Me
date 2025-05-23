import { Global, Module } from '@nestjs/common';
import { Logger } from '../services/logger.service';
import { LoggerInterceptor } from '../../interceptors/logger.interceptor';

@Global()
@Module({
  providers: [
    Logger,
    {
      provide: LoggerInterceptor,
      useFactory: (logger: Logger) => {
        return new LoggerInterceptor(logger);
      },
      inject: [Logger],
    },
  ],
  exports: [Logger, LoggerInterceptor],
})
export class LoggerModule {}

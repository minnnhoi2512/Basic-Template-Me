import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CorsInterceptor } from '../interceptors/cors.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CorsInterceptor,
    },
  ],
})
export class CorsModule {}

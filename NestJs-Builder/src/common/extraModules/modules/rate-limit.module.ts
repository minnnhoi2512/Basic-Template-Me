import { Module } from '@nestjs/common';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerExceptionFilter } from '../filters/throttler-exception.filter';
import {
  NUMBER_OF_REQUEST,
  RATE_LIMIT_TTL,
} from 'src/common/constants/rate-limit';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: RATE_LIMIT_TTL, 
          limit: NUMBER_OF_REQUEST, 
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ThrottlerExceptionFilter,
    },
  ],
})
export class RateLimitModule {}

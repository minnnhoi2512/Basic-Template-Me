import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.getOrThrow('redis.host'),
        port: configService.getOrThrow('redis.port'),
        username: configService.getOrThrow('redis.username'),
        password: configService.getOrThrow('redis.password'),
        ttl: 60 * 60 * 24, // 24 hours
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}

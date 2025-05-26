import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from '../controllers/health.controller';
import { DatabaseHealthIndicator } from '../indicators/database.health';
import { MemoryHealthIndicator } from '../indicators/memory.health';
import { RedisHealthIndicator } from '../indicators/redis.health';
import { RedisModule } from './redis.module';

@Module({
  imports: [TerminusModule, HttpModule, RedisModule],
  controllers: [HealthController],
  providers: [
    DatabaseHealthIndicator,
    MemoryHealthIndicator,
    RedisHealthIndicator,
  ],
})
export class HealthModule {}

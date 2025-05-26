import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from '../controllers/health.controller';
import { DatabaseHealthIndicator } from '../indicators/database.health';
import { MemoryHealthIndicator } from '../indicators/memory.health';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [DatabaseHealthIndicator, MemoryHealthIndicator],
})
export class HealthModule {}

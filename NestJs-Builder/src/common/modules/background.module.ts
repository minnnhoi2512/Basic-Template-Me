import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from './logger.module';
import { BackgroundService } from '../services/background.service';
import { SchedulerService } from '../services/scheduler.service';
@Module({
  imports: [ScheduleModule.forRoot(), LoggerModule],
  providers: [BackgroundService, SchedulerService],
})
export class BackgroundModule {}

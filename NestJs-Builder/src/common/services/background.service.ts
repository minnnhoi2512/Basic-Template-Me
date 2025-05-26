import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BackgroundService {
  private readonly logger = new Logger(BackgroundService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleMidnightTasks() {
    this.logger.log('Running midnight tasks...');
    // Add your midnight tasks here
  }

  @Cron(CronExpression.EVERY_HOUR)
  handleHourlyTasks() {
    this.logger.log('Running hourly tasks...');
    // Add your hourly tasks here
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  handleHalfHourlyTasks() {
    this.logger.log('Running half-hourly tasks...');
    // Add your half-hourly tasks here
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  handleDailyMaintenance() {
    this.logger.log('Running daily maintenance tasks...');
    // Add your daily maintenance tasks here
  }
}

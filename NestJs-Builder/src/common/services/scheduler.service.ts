import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  @Cron(CronExpression.EVERY_5_SECONDS)
  handleEvery5Seconds() {
    this.logger.log('Đụng vào máy là gay, ngoài trừ Minh Hội');
  }
}

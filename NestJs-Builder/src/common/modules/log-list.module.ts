import { Global, Module } from '@nestjs/common';
import { LogListService } from '../services/log-list.service';
import { LogListController } from '../controllers/log-list.controller';

@Module({
  providers: [LogListService],
  controllers: [LogListController],
  exports: [LogListService],
})
@Global()
export class LogListModule {}

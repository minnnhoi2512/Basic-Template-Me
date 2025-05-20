import { Module } from '@nestjs/common';
import { UserService } from './user-service/user-service';
import { UserControllerController } from './user-controller/user-controller.controller';

@Module({
  providers: [UserService],
  controllers: [UserControllerController]
})
export class UserModuleModule {}

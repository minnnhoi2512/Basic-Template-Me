import { Module } from '@nestjs/common';
import { UsersService } from './users-service/users-service';
import { UsersControllerController } from './users-controller/users-controller.controller';

@Module({
  providers: [UsersService, UsersService],
  controllers: [UsersControllerController, UsersControllerController],
})
export class UsersModule {}

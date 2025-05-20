import { Test, TestingModule } from '@nestjs/testing';
import { UserControllerController } from './user-controller.controller';

describe('UserControllerController', () => {
  let controller: UserControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserControllerController],
    }).compile();

    controller = module.get<UserControllerController>(UserControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

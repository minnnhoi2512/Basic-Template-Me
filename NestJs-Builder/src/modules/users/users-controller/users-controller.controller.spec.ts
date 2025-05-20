import { Test, TestingModule } from '@nestjs/testing';
import { UsersControllerController } from './users-controller.controller';

describe('UsersControllerController', () => {
  let controller: UsersControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersControllerController],
    }).compile();

    controller = module.get<UsersControllerController>(UsersControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

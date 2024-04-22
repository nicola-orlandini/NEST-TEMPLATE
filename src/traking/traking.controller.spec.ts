import { Test, TestingModule } from '@nestjs/testing';
import { TrakingController } from './traking.controller';

describe('TrakingController', () => {
  let controller: TrakingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrakingController],
    }).compile();

    controller = module.get<TrakingController>(TrakingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

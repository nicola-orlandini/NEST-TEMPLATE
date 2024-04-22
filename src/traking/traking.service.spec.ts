import { Test, TestingModule } from '@nestjs/testing';
import { TrakingService } from './traking.service';

describe('TrakingService', () => {
  let service: TrakingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrakingService],
    }).compile();

    service = module.get<TrakingService>(TrakingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

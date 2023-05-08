import { Test, TestingModule } from '@nestjs/testing';
import { VehicleDetailService } from './vehicle_detail.service';

describe('VehicleDetailService', () => {
  let service: VehicleDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleDetailService],
    }).compile();

    service = module.get<VehicleDetailService>(VehicleDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { VehicleDetailController } from './vehicle_detail.controller';

describe('VehicleDetailController', () => {
  let controller: VehicleDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleDetailController],
    }).compile();

    controller = module.get<VehicleDetailController>(VehicleDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

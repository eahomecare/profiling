import { Test, TestingModule } from '@nestjs/testing';
import { ServiceCustomerController } from './service-customer.controller';

describe('ServiceCustomerController', () => {
  let controller: ServiceCustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceCustomerController],
    }).compile();

    controller = module.get<ServiceCustomerController>(ServiceCustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

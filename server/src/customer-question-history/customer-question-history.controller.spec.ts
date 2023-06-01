import { Test, TestingModule } from '@nestjs/testing';
import { CustomerQuestionHistoryController } from './customer-question-history.controller';

describe('CustomerQuestionHistoryController', () => {
  let controller: CustomerQuestionHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerQuestionHistoryController],
    }).compile();

    controller = module.get<CustomerQuestionHistoryController>(CustomerQuestionHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CustomerQuestionHistoryService } from './customer-question-history.service';

describe('CustomerQuestionHistoryService', () => {
  let service: CustomerQuestionHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerQuestionHistoryService],
    }).compile();

    service = module.get<CustomerQuestionHistoryService>(CustomerQuestionHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

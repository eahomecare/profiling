import { Module } from '@nestjs/common';
import { CustomerQuestionHistoryController } from './customer-question-history.controller';
import { CustomerQuestionHistoryService } from './customer-question-history.service';

@Module({
  controllers: [CustomerQuestionHistoryController],
  providers: [CustomerQuestionHistoryService]
})
export class CustomerQuestionHistoryModule {}

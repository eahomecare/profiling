import {
  Body,
  Controller,
  Get,
  Post,
  Param,
} from '@nestjs/common';
import { CustomerQuestionHistoryService } from './customer-question-history.service';

@Controller('customer-question-history')
export class CustomerQuestionHistoryController {
  constructor(
    private readonly customerQuestionHistoryService: CustomerQuestionHistoryService,
  ) {}

  @Post()
  async createQuestionHistory(
    @Body()
    payload: {
      customerId: string;
      history: object;
    },
  ) {
    const { customerId, history } = payload;
    return this.customerQuestionHistoryService.createQuestionHistory(
      customerId,
      history,
    );
  }

  @Get(':customerId')
  async getQuestionHistory(
    @Param('customerId') customerId: string,
  ) {
    return this.customerQuestionHistoryService.getQuestionHistory(
      customerId,
    );
  }
}

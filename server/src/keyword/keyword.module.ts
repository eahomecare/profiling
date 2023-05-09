import { Module } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { KeywordController } from './keyword.controller';
import { CustomerService } from 'src/customer/customer.service';

@Module({
  controllers: [KeywordController],
  providers: [KeywordService, CustomerService],
})
export class KeywordModule {}

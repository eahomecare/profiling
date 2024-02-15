import { Module } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { KeywordController } from './keyword.controller';
import { CustomerService } from '../customer/customer.service';
import { ProfileTypeCustomerMappingService } from 'src/profile-type-customer-mapping/profile-type-customer-mapping.service';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  controllers: [KeywordController],
  imports: [CustomerModule],
  providers: [
    KeywordService,
    CustomerService,
    ProfileTypeCustomerMappingService,
  ],
})
export class KeywordModule {}

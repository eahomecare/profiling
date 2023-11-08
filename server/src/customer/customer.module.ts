import { Module } from '@nestjs/common';
import { ProfileTypeCustomerMappingService } from 'src/profile-type-customer-mapping/profile-type-customer-mapping.service';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  controllers: [CustomerController],
  providers: [
    CustomerService,
    ProfileTypeCustomerMappingService,
  ],
})
export class CustomerModule {}

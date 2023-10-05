import { Module } from '@nestjs/common';
import { ProfileTypeCustomerMappingController } from './profile-type-customer-mapping.controller';
import { ProfileTypeCustomerMappingService } from './profile-type-customer-mapping.service';

@Module({
  controllers: [ProfileTypeCustomerMappingController],
  providers: [ProfileTypeCustomerMappingService]
})
export class ProfileTypeCustomerMappingModule {}

import { Module } from '@nestjs/common';
import { CustomerElasticService } from 'src/customer/customerElastic.service';
import { ProfileCountWidgetService } from 'src/widgets/profileCountWidget.service';
import { ProfileTypeCustomerMappingController } from './profile-type-customer-mapping.controller';
import { ProfileTypeCustomerMappingService } from './profile-type-customer-mapping.service';

@Module({
  controllers: [
    ProfileTypeCustomerMappingController,
  ],
  providers: [
    ProfileTypeCustomerMappingService,
    CustomerElasticService,
    ProfileCountWidgetService,
  ],
  exports: [ProfileTypeCustomerMappingService],
})
export class ProfileTypeCustomerMappingModule {}

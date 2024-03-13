import {
  forwardRef,
  Module,
} from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ProfileTypeCustomerMappingModule } from 'src/profile-type-customer-mapping/profile-type-customer-mapping.module';
import { ProfileTypeCustomerMappingService } from 'src/profile-type-customer-mapping/profile-type-customer-mapping.service';
import { ProfileModule } from 'src/profile/profile.module';
import { ProfileService } from 'src/profile/profile.service';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerElasticService } from './customerElastic.service';

@Module({
  controllers: [CustomerController],
  imports: [
    ProfileModule,
    ProfileTypeCustomerMappingModule,
  ],
  providers: [
    CustomerService,
    CustomerElasticService,
  ],
  exports: [CustomerElasticService],
})
export class CustomerModule {}

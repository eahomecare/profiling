import { Module } from '@nestjs/common';
import { ProfileMappingController } from './profile_mapping.controller';
import { ProfileTypeCustomerMappingService } from './profile_mapping.service';

@Module({
  controllers: [ProfileMappingController],
  providers:[ProfileTypeCustomerMappingService]
})
export class ProfileMappingModule {}

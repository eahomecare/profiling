import { Module } from '@nestjs/common';
import { CustomerElasticService } from 'src/customer/customerElastic.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}

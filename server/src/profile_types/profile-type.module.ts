import { Module } from '@nestjs/common';
import { ProfileTypeController } from './profile-type.controller';
import { ProfileTypesService } from './profile-type.service';

@Module({
  controllers: [ProfileTypeController],
  providers: [ProfileTypesService],
})
export class ProfileTypesModule {}

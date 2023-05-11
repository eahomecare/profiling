import { Module } from '@nestjs/common';
import { OccupationController } from './occupation.controller';
import { OccupationService } from './occupation.service';
import { OccupationCustomerMappingService } from './occupation-customer-mapping.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [OccupationController],
  providers: [
    OccupationService,
    OccupationCustomerMappingService,
    PrismaClient,
  ],
})
export class OccupationModule {}

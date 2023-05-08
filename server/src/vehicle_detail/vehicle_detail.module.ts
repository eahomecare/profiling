import { Module } from '@nestjs/common';
import { Vehicle_DetailController } from './vehicle_detail.controller';
import { Vehicle_DetailService } from './vehicle_detail.service';
import { PrismaClient } from '@prisma/client';


@Module({
  controllers: [Vehicle_DetailController],
  providers: [Vehicle_DetailService,PrismaClient]
})
export class VehicleDetailModule {}

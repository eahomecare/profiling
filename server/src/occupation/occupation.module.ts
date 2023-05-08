import { Module } from '@nestjs/common';
import { OccupationController } from './occupation.controller';
import { OccupationService } from './occupation.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [OccupationController],
  providers: [OccupationService, PrismaClient],
})
export class OccupationModule {}
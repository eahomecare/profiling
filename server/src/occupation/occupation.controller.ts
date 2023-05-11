import {
  Body,
  Controller,
  Post,
  Get,
  Param,
} from '@nestjs/common';
import { OccupationService } from './occupation.service';
import { Occupation } from '@prisma/client';
import { OccupationCustomerMappingService } from './occupation-customer-mapping.service';

@Controller('occupations')
export class OccupationController {
  constructor(
    private occupationService: OccupationService,
    private occupationCustomerMappingService: OccupationCustomerMappingService,
  ) {}

  @Post()
  async create(@Body() payload): Promise<any> {
    const {
      vehicleId,
      title,
      industry,
      from,
      to,
      incomeBracket,
      customerId,
    } = payload;

    const occupation =
      await this.occupationService.findOne(
        vehicleId,
      );

    if (occupation || !!vehicleId) {
      await this.occupationCustomerMappingService.create(
        customerId,
        occupation.id,
        incomeBracket,
        from,
        to,
      );
    } else {
      const newOccupation =
        await this.occupationService.create(
          title,
          industry,
        );

      await this.occupationCustomerMappingService.create(
        customerId,
        newOccupation.id,
        incomeBracket,
        from,
        to,
      );
    }

    return { success: true };
  }

  @Get(':customerId')
  async findAllByCustomerId(
    @Param('customerId') customerId: string,
  ): Promise<Occupation[]> {
    return await this.occupationService.findAllByCustomerId(
      customerId,
    );
  }
}

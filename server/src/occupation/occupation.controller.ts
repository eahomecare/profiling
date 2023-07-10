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
import { OccupationCustomerMapping } from '@prisma/client';
import { DateTime } from 'luxon';

@Controller('api/occupations')
export class OccupationController {
  constructor(
    private occupationService: OccupationService,
    private occupationCustomerMappingService: OccupationCustomerMappingService,
  ) { }

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

    let fromDate = null;
    let toDate = null;

    if (typeof from === 'string') {
      fromDate = new Date(from);
    } else if (from instanceof DateTime) {
      fromDate = from;
    }

    if (typeof to === 'string') {
      toDate = new Date(to);
    } else if (to instanceof DateTime) {
      toDate = to;
    }

    const occupation = !!vehicleId
      ? await this.occupationService.findOne(
        vehicleId,
      )
      : null;

    if (occupation || !!vehicleId) {
      await this.occupationCustomerMappingService.create(
        customerId,
        occupation.id,
        incomeBracket,
        fromDate,
        toDate,
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
        fromDate,
        toDate,
      );
    }

    return { success: true };
  }

  @Get(':customerId')
  async findAllByCustomerId(
    @Param('customerId') customerId: string,
  ): Promise<OccupationCustomerMapping[]> {
    const mappings =
      await this.occupationService.findAllByCustomerId(
        customerId,
      );
    return this.occupationService.populateOccupations(
      mappings,
    );
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ProfileTypeCustomerMappingService } from './profile-type-customer-mapping.service';
import { ProfileTypeCustomerMapping } from '@prisma/client';

@Controller('profile-type-customer-mapping')
export class ProfileTypeCustomerMappingController {
  constructor(
    private readonly profileTypeCustomerMappingService: ProfileTypeCustomerMappingService,
  ) {}

  @Post()
  create(
    @Body() data: ProfileTypeCustomerMapping,
  ) {
    return this.profileTypeCustomerMappingService.create(
      data,
    );
  }

  @Get()
  findAll() {
    return this.profileTypeCustomerMappingService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //     return this.profileTypeCustomerMappingService.findOne(id);
  // }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: ProfileTypeCustomerMapping,
  ) {
    return this.profileTypeCustomerMappingService.update(
      id,
      data,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileTypeCustomerMappingService.remove(
      id,
    );
  }

  @Get('grouped-counts-by-profile-type-name')
  async getGroupedCountsByProfileTypeName() {
    return this.profileTypeCustomerMappingService.getGroupedCountsByCustomerAgeRange();
  }

  @Get('by-age-range/:ageRange')
  async getCustomersByAgeRangeForProfileTypeCustomerMappings(
    @Param('ageRange') ageRange: string,
  ) {
    return this.profileTypeCustomerMappingService.getCustomersByAgeRangeForProfileTypeCustomerMappings(
      ageRange,
    );
  }

  @Get('by-gender/:gender')
  async getCustomersByGenderForProfileTypeCustomerMappings(
    @Param('gender') gender: string,
  ) {
    return this.profileTypeCustomerMappingService.getCustomersByGenderForProfileTypeCustomerMappings(
      gender,
    );
  }

  @Post('groupByAll')
  async getGrouped(@Body() data: any) {
    return {
      profiles:
        await this.profileTypeCustomerMappingService.getGroupedCountsByProfileTypeName(),
      gender:
        await this.profileTypeCustomerMappingService.getGroupedCountsByCustomerGender(),
      ageRange:
        await this.profileTypeCustomerMappingService.getGroupedCountsByCustomerAgeRange(),
      source:
        await this.profileTypeCustomerMappingService.getGroupedCountsByCustomerSource(),
    };
  }
}

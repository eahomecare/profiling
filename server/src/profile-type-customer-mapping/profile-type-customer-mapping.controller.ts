import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ProfileTypeCustomerMappingService } from './profile-type-customer-mapping.service';
import { ProfileTypeCustomerMapping } from '@prisma/client';

@Controller('profile-type-customer-mapping')
export class ProfileTypeCustomerMappingController {
  private readonly logger = new Logger(
    ProfileTypeCustomerMappingController.name,
  );
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

  @Get('profile-customer-mappings-by-profile/:id')
  fetchMappings(@Param('id') id: string) {
    return this.profileTypeCustomerMappingService.findAllByProfileTypeId(
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

  @Get('update_level_by_keywords/:customer_id')
  async updateProfileLevelUpdate(
    @Param('customer_id') customer_id: string,
  ) {
    return this.profileTypeCustomerMappingService.updateProfileTypeCustomerMappingGeneric(
      customer_id,
    );
  }

  @Get('/by-customer/:customerId')
  async getProfileTypeMappingsByCustomerId(
    @Param('customerId') customerId: string,
  ) {
    this.logger.log(
      `Fetching profile type mappings for customer ID: ${customerId}`,
    );
    try {
      const mappings =
        await this.profileTypeCustomerMappingService.findAllByCustomerId(
          customerId,
        );
      return mappings;
    } catch (error) {
      this.logger.error(
        `Error fetching profile type mappings for customer ID ${customerId}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        'Could not fetch profile type mappings',
      );
    }
  }

  @Get('customer-mapping/:customerId')
  async getCustomerMappingByCustomerId(
    @Param('customerId') customerId: string,
  ) {
    return this.profileTypeCustomerMappingService.getCustomerMappingByCustomerId(
      customerId,
    );
  }
}

import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { ProfileTypeCustomerMappingService } from './profile_mapping.service';
const _ = require('lodash');

@Controller('api/profile_mapping')
export class ProfileMappingController {
  constructor(
    private readonly profileService: ProfileTypeCustomerMappingService,
  ) { }

  @Get(':customerId')
  async getProfileMappings(
    @Param('customerId') customerId: string,
  ) {

    console.log('Recieved customer id for profile_mapping', customerId)
    const mappings =
      await this.profileService.getProfileMappings(
        customerId,
      );

    console.log('mappings =>', mappings)

    const categories = {};
    for (const mapping of mappings) {
      const { profileType, customer, level } =
        mapping;

      const keywords = customer.keywords;

      console.log('unfiltered keywords', keywords)

      const categoryName =
        profileType.name.toLowerCase();

      if (!categories[categoryName]) {
        categories[categoryName] = [];
        categories[categoryName].push({
          key: categoryName,
          level: 1,
        });
      }

      const filtered_keywords = _.filter(
        keywords,
        { category: categoryName },
      );

      console.log('filtered keywords', keywords)

      for (const keyword of filtered_keywords) {
        categories[categoryName].push({
          key: keyword.value.toLowerCase(),
          level: keyword.level,
        });
      }
    }

    console.dir('Categories objec in response', categories)

    return { categories };
  }
}

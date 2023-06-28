import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { ProfileTypeCustomerMappingService } from './profile_mapping.service';
const _ = require('lodash');

@Controller('profile_mapping')
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

    const categories = {};
    for (const mapping of mappings) {
      const { profileType, customer, level } =
        mapping;

      const keywords = customer.keywords;

      const categoryName =
        profileType.name.toLowerCase();

      if (!categories[categoryName]) {
        categories[categoryName] = [];
      }

      categories[categoryName].push({
        key: categoryName,
        level: 1,
      });
      const filtered_keywords = _.filter(
        keywords,
        { category: categoryName },
      );

      for (const keyword of filtered_keywords) {
        categories[categoryName].push({
          key: keyword.value.toLowerCase(),
          level: keyword.level,
        });
      }
    }

    console.log('Categories objec in response', { categories })

    return { categories };
  }
}

// profile.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ProfileTypeCustomerMappingService } from './profile_mapping.service';

@Controller('profiles')
export class ProfileMappingController {
  constructor(private readonly profileService: ProfileTypeCustomerMappingService) {}

  @Get(':customerId')
  async getProfileMappings(@Param('customerId') customerId: string) {
    const mappings = await this.profileService.getProfileMappings(customerId);

    // Transform the mappings into the desired format
    const categories = {};
    for (const mapping of mappings) {
      const { profileType, customer, level } = mapping;
      const keywords = customer.keywords;

      if (!categories[profileType.name]) {
        categories[profileType.name] = [];
      }

      for (const keyword of keywords) {
        categories[profileType.name].push({ key: keyword.value, level });
      }
    }

    return { categories };
  }
}

// profile-type-customer-mapping.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ProfileTypeCustomerMappingService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfileMappings(customerId: string) {
    return this.prisma.profileTypeCustomerMapping.findMany({
      where: { customerId },
      include: {
        profileType: true,
        customer: {
          include: {
            keywords: true,
          },
        },
      },
    });
  }
}

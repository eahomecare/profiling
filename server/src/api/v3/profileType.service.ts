import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProfileTypeService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getProfileTypesForCustomer(
    customerId: string,
  ): Promise<any[]> {
    try {
      const profileTypeMappings =
        await this.prisma.profileTypeCustomerMapping.findMany(
          {
            where: {
              customerId: customerId,
              level: {
                gt: 1,
              },
            },
            select: {
              profileType: {
                select: {
                  id: true,
                  name: true,
                  srcUrl: true,
                },
              },
            },
          },
        );

      if (profileTypeMappings.length === 0) {
        return [];
      }

      return profileTypeMappings.map(
        (mapping) => mapping.profileType,
      );
    } catch (error) {
      console.error(error.message);
      throw new NotFoundException(
        `Failed to retrieve profile types for customer:`,
      );
    }
  }
}

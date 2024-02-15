import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async calculateAndSaveProfileCompletion(
    customerId: string,
  ): Promise<number> {
    const customer =
      await this.prisma.customer.findUnique({
        where: { id: customerId },
        include: {
          personal_details: true,
          keywords: true,
          OccupationCustomerMappings: true,
          VehicleCustomerMappings: true,
        },
      });

    if (!customer) {
      throw new Error('Customer not found');
    }

    let completionPercentage = 0;

    if (customer.personal_details)
      completionPercentage += 25;
    if (
      customer.OccupationCustomerMappings.length >
      0
    )
      completionPercentage += 25;
    if (
      customer.VehicleCustomerMappings.length > 0
    )
      completionPercentage += 25;
    if (
      customer.keywords.length > 0 &&
      customer.keywords.length < 10
    ) {
      completionPercentage +=
        25 * (customer.keywords.length / 10);
    } else if (customer.keywords.length >= 10) {
      completionPercentage += 25;
    }

    completionPercentage = Math.round(
      completionPercentage,
    );

    await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        profile_percentage: completionPercentage,
      },
    });

    return completionPercentage;
  }

  async getProfileCompletion(
    customerId: string,
  ): Promise<number> {
    const customer =
      await this.prisma.customer.findUnique({
        where: { id: customerId },
        select: { profile_percentage: true },
      });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer.profile_percentage ?? 0;
  }
}

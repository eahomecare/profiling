import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Controller('profile')
export class ProfileController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  @Get(':customerId')
  async getProfileCompletion(
    @Param('customerId') customerId: string,
  ) {
    try {
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

      console.log(customer);

      let completionPercentage = 0;

      if (customer.personal_details) {
        completionPercentage += 25;
      }

      if (
        customer.OccupationCustomerMappings
          .length > 0
      ) {
        completionPercentage += 25;
      }

      if (
        customer.VehicleCustomerMappings.length >
        0
      ) {
        completionPercentage += 25;
      }

      console.log(customer.keywords.length);

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

      return { completionPercentage };
    } catch (error) {
    } finally {
      await this.prisma.$disconnect();
    }
  }
}

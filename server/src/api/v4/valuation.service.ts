import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ValuationService {
  constructor(private prisma: PrismaService) {}

  async isCustomerHNI(
    customerId: string,
  ): Promise<boolean> {
    const customerHomecareMapping =
      await this.prisma.customerHomecareMapping.findFirst(
        {
          where: {
            master_customer_id: customerId,
          },
          include: {
            customer_homecare: {
              include: {
                personalDetails: true,
              },
            },
          },
        },
      );

    if (customerHomecareMapping) {
      const planId =
        customerHomecareMapping.customer_homecare
          ?.personalDetails?.planId;
      const hniPlanIds = [
        'Plan013',
        'Plan007',
        'Plan008',
      ];
      if (hniPlanIds.includes(planId)) {
        return true;
      }
    }

    // Check for HNI keyword
    const customerWithHNIKeyword =
      await this.prisma.customer.findFirst({
        where: {
          id: customerId,
          keywords: {
            some: {
              value: 'HNI',
            },
          },
        },
      });

    return !!customerWithHNIKeyword;
  }
}

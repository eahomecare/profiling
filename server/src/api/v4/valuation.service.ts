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

    if (!customerHomecareMapping) {
      return false;
    }

    const planId =
      customerHomecareMapping.customer_homecare
        ?.personalDetails?.planId;
    const hniPlanIds = [
      'Plan014',
      'Plan007',
      'Plan008',
    ];
    return hniPlanIds.includes(planId);
  }
}

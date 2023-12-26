import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ValuationService {
  constructor(private prisma: PrismaService) {}

  async isCustomerHNI(
    customerId: string,
  ): Promise<boolean> {
    const customer =
      await this.prisma.customer.findUnique({
        where: {
          id: customerId,
        },
        include: {
          CustomerHomecareMapping: {
            include: {
              customer_homecare: {
                include: {
                  personalDetails: true,
                },
              },
            },
          },
          keywords: true,
        },
      });

    if (!customer) {
      return false;
    }

    const planId =
      customer.CustomerHomecareMapping
        ?.customer_homecare?.personalDetails
        ?.planId;
    const hniPlanIds = [
      'Plan014',
      'Plan007',
      'Plan008',
    ];
    const isHNIPlan = hniPlanIds.includes(planId);

    const hasHNIKeyword = customer.keywords.some(
      (keyword) => keyword.value === 'HNI',
    );

    return isHNIPlan || hasHNIKeyword;
  }
}

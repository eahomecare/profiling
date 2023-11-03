import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Customer } from '@prisma/client';

@Injectable()
export class KeywordsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getKeywordsForCustomer(
    customer: Customer,
  ) {
    if (!customer) {
      throw new UnauthorizedException(
        'No customer provided',
      );
    }

    const customerWithKeywords =
      await this.prisma.customer.findUnique({
        where: { id: customer.id },
        include: {
          keywords: {
            select: {
              id: true,
              category: true,
              value: true,
              level: true,
              customerIDs: false,
              questionIDs: false,
              profileTypeIDs: false,
            },
          },
        },
      });

    if (!customerWithKeywords) {
      throw new UnauthorizedException(
        'No customer found with provided ID',
      );
    }

    return {
      customerKeywords:
        customerWithKeywords.keywords,
    };
  }
}


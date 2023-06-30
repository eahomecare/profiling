import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OccupationCustomerMapping } from '.prisma/client';

@Injectable()
export class OccupationCustomerMappingService {
  constructor(private prisma: PrismaService) { }

  async create(
    customerId: string,
    occupationId: string,
    incomeBracket: string,
    from: Date,
    to: Date,
  ): Promise<OccupationCustomerMapping> {
    return await this.prisma.occupationCustomerMapping.create(
      {
        data: {
          customerId,
          occupationId,
          incomeBracket,
          from,
          to,
        },
      },
    );
  }
}

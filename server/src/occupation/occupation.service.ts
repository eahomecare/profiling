import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class OccupationService {
  constructor(private readonly prisma: PrismaClient) {}

  async createOccupationAndMapping(payload: {
    type: string;
    industry: string;
    from: number;
    to: number;
    incomeBracket: string;
    customerId: string;
  }) {
    const { type, industry, from, to, incomeBracket, customerId } = payload;

    // Create Occupation
    const occupation = await this.prisma.occupation.create({
      data: { title: type, industry },
    });

    // Create OccupationCustomerMapping
    const occupationCustomerMapping = await this.prisma.occupationCustomerMapping.create(
      {
        data: {
          occupationId: occupation.id,
          customerId,
          incomeBracket,
          from,
          to,
        },
      },
    );

    return {
      occupation,
      occupationCustomerMapping,
    };
  }
}

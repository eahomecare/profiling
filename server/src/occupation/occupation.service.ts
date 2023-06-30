import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Occupation } from '.prisma/client';
// import { OccupationCustomerMapping } from '.prisma/client';

interface OccupationCustomerMapping {
  id: string;
  occupationId: string;
  customerId: string;
  incomeBracket: string;
  from: Date;
  to: Date;
  occupation?: Occupation;
}

@Injectable()
export class OccupationService {
  constructor(private prisma: PrismaService) { }

  async findOne(
    vehicleId: string,
  ): Promise<Occupation | null> {
    return await this.prisma.occupation.findUnique(
      {
        where: {
          id: vehicleId,
        },
      },
    );
  }

  async create(
    title: string,
    industry: string,
  ): Promise<Occupation> {
    return await this.prisma.occupation.create({
      data: {
        title: title,
        industry: industry,
      },
    });
  }

  async findAllByCustomerId(
    customerId: string,
  ): Promise<OccupationCustomerMapping[]> {
    return await this.prisma.occupationCustomerMapping.findMany(
      {
        where: {
          customerId,
        },
      },
    );
  }

  async populateOccupations(
    mappings: OccupationCustomerMapping[],
  ): Promise<OccupationCustomerMapping[]> {
    const populatedMappings: OccupationCustomerMapping[] =
      [];

    for (const mapping of mappings) {
      const occupation =
        await this.prisma.occupation.findUnique({
          where: {
            id: mapping.occupationId,
          },
        });
      populatedMappings.push({
        ...mapping,
        occupation,
      });
    }

    return populatedMappings;
  }
}

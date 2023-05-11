import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Occupation } from '.prisma/client';

@Injectable()
export class OccupationService {
  constructor(private prisma: PrismaService) {}

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
  ): Promise<Occupation[]> {
    return await this.prisma.occupation.findMany({
      where: {
        customers: {
          some: {
            customerId,
          },
        },
      },
    });
  }
}

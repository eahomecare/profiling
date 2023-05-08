import { PrismaClient, Occupation } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OccupationService {
  constructor(private prisma: PrismaClient) {}

  async create(data: Omit<Occupation, 'id'>): Promise<Occupation> {
    return this.prisma.occupation.create({ data });
  }

  async findAll(): Promise<Occupation[]> {
    return this.prisma.occupation.findMany();
  }

  async findOne(id: string): Promise<Occupation | null> {
    return this.prisma.occupation.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: Partial<Omit<Occupation, 'id'>>,
  ): Promise<Occupation | null> {
    return this.prisma.occupation.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Occupation | null> {
    return this.prisma.occupation.delete({ where: { id } });
  }
}

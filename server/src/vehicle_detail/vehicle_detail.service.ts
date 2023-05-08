import { PrismaClient, Vehicle_Detail } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Vehicle_DetailService {
  constructor(private prisma: PrismaClient) {}

  async create(data: Omit<Vehicle_Detail, 'id'>): Promise<Vehicle_Detail> {
    return this.prisma.vehicle_Detail.create({ data });
  }

  async findAll(): Promise<Vehicle_Detail[]> {
    return this.prisma.vehicle_Detail.findMany();
  }

  async findOne(id: string): Promise<Vehicle_Detail | null> {
    return this.prisma.vehicle_Detail.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: Partial<Omit<Vehicle_Detail, 'id'>>,
  ): Promise<Vehicle_Detail | null> {
    return this.prisma.vehicle_Detail.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Vehicle_Detail | null> {
    return this.prisma.vehicle_Detail.delete({ where: { id } });
  }
}

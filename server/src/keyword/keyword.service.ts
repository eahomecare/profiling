import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Keyword } from '@prisma/client';

@Injectable()
export class KeywordService {
  constructor(private prisma: PrismaService) {}

  async create(data: Keyword): Promise<Keyword> {
    return this.prisma.keyword.create({ data });
  }

  async findAll(): Promise<Keyword[]> {
    return this.prisma.keyword.findMany();
  }

  async findOne(id: string): Promise<Keyword | null> {
    return this.prisma.keyword.findUnique({ where: { id } });
  }

  async update(id: string, data: Keyword): Promise<Keyword> {
    return this.prisma.keyword.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Keyword> {
    return this.prisma.keyword.delete({ where: { id } });
  }
}

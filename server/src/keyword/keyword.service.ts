import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Keyword } from '@prisma/client';

@Injectable()
export class KeywordService {
  constructor(private prisma: PrismaService) {}

  async create(data: Keyword): Promise<Keyword> {
    try {
      const createdKeyword = await this.prisma.keyword.create({ data });
  
      if (createdKeyword.customerIDs && createdKeyword.customerIDs.length > 0) {
        await Promise.all(
          createdKeyword.customerIDs.map(async (customerId) => {
            const customer = await this.prisma.customer.update({
              where: { id: customerId },
              data: {
                keywordIDs: {
                  push: createdKeyword.id,
                },
              },
            });
            return customer;
          })
        );
      }
  
      return createdKeyword;
    } catch (error) {
      throw new Error(`Could not create keyword: ${error.message}`);
    }
  }
  

  async findAll(): Promise<Keyword[]> {
    try {
      return await this.prisma.keyword.findMany({
        include: {
          customers: true,
        },
      });
    } catch (error) {
      throw new Error(`Could not find keywords: ${error.message}`);
    }
  }
  

  async findOne(id: string): Promise<Keyword | null> {
    try {
      return await this.prisma.keyword.findUnique({ where: { id } });
    } catch (error) {
      throw new Error(`Could not find keyword with id ${id}: ${error.message}`);
    }
  }

  async update(id: string, data: Keyword): Promise<Keyword> {
    try {
      return await this.prisma.keyword.update({ where: { id }, data });
    } catch (error) {
      throw new Error(`Could not update keyword with id ${id}: ${error.message}`);
    }
  }

  async remove(id: string): Promise<Keyword> {
    try {
      return await this.prisma.keyword.delete({ where: { id } });
    } catch (error) {
      throw new Error(`Could not delete keyword with id ${id}: ${error.message}`);
    }
  }
}

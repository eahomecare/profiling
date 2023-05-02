import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Customer,
  Keyword,
} from '@prisma/client';
const { RegExp } = require('mongodb');

@Injectable()
export class KeywordService {
  constructor(private prisma: PrismaService) {}

  async create(data: Keyword): Promise<Keyword> {
    try {
      const createdKeyword =
        await this.prisma.keyword.create({
          data,
        });

      if (
        createdKeyword.customerIDs &&
        createdKeyword.customerIDs.length > 0
      ) {
        await Promise.all(
          createdKeyword.customerIDs.map(
            async (customerId) => {
              const customer =
                await this.prisma.customer.update(
                  {
                    where: { id: customerId },
                    data: {
                      keywordIDs: {
                        push: createdKeyword.id,
                      },
                    },
                  },
                );
              return customer;
            },
          ),
        );
      }

      return createdKeyword;
    } catch (error) {
      throw new Error(
        `Could not create keyword: ${error.message}`,
      );
    }
  }

  async findByCategoryAndValue(
    category: string,
    value: string,
  ): Promise<Keyword | null> {
    const keywords =
      await this.prisma.keyword.findMany({
        where: {
          AND: [
            { category: category },
            { value: value },
          ],
        },
      });

    return keywords[0] || null;
  }

  async findAll(): Promise<Keyword[]> {
    try {
      return await this.prisma.keyword.findMany({
        include: {
          customers: false,
        },
      });
    } catch (error) {
      throw new Error(
        `Could not find keywords: ${error.message}`,
      );
    }
  }

  async findOne(
    id: string,
  ): Promise<Keyword | null> {
    try {
      return await this.prisma.keyword.findUnique(
        { where: { id } },
      );
    } catch (error) {
      throw new Error(
        `Could not find keyword with id ${id}: ${error.message}`,
      );
    }
  }

  async search(
    query: string,
  ): Promise<Keyword[]> {
    try {
      const keywords =
        await this.prisma.keyword.findMany({
          where: {
            OR: [
              {
                category: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                value: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
        });
      return keywords;
    } catch (error) {
      throw new Error(
        `Could not search for keywords: ${error.message}`,
      );
    }
  }

  async update(
    id: string,
    data: Keyword,
  ): Promise<Keyword> {
    try {
      const keyword =
        await this.prisma.keyword.update({
          where: { id },
          data,
        });

      let customersToUpdate = [];
      if (
        data.customerIDs &&
        data.customerIDs.length > 0
      ) {
        customersToUpdate = await Promise.all(
          data.customerIDs.map(
            async (customerId) => {
              const customer =
                await this.prisma.customer.update(
                  {
                    where: { id: customerId },
                    data: {
                      keywordIDs: {
                        push: keyword.id,
                      },
                    },
                  },
                );
              return customer;
            },
          ),
        );
      }

      // Update Elasticsearch index
      // await this.elasticsearchService.updateIndex(keyword);

      return keyword;
    } catch (error) {
      throw new Error(
        `Could not update keyword with id ${id}: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<Keyword> {
    try {
      const deletedKeyword =
        await this.prisma.keyword.delete({
          where: { id },
          include: { customers: true },
        });

      if (
        deletedKeyword.customers &&
        deletedKeyword.customers.length > 0
      ) {
        await Promise.all(
          deletedKeyword.customers.map(
            async (customer) => {
              const updatedCustomer =
                await this.prisma.customer.update(
                  {
                    where: { id: customer.id },
                    data: {
                      keywordIDs: {
                        set: customer.keywordIDs.filter(
                          (keywordId) =>
                            keywordId !==
                            deletedKeyword.id,
                        ),
                      },
                    },
                  },
                );
              return updatedCustomer;
            },
          ),
        );
      }

      return deletedKeyword;
    } catch (error) {
      throw new Error(
        `Could not delete keyword with id ${id}: ${error.message}`,
      );
    }
  }

  async findByCustomerId(
    customerId: string,
  ): Promise<Keyword[]> {
    try {
      const keywords =
        await this.prisma.keyword.findMany({
          where: {
            customerIDs: {
              has: customerId,
            },
          },
        });
      return keywords;
    } catch (error) {
      throw new Error(
        `Could not find keywords for customer with id ${customerId}: ${error.message}`,
      );
    }
  }

  async removeCustomerFromKeywords(
    customerId: string,
  ): Promise<void> {
    try {
      const keywords =
        await this.prisma.keyword.findMany({
          where: {
            customerIDs: {
              has: customerId,
            },
          },
        });

      const updatedKeywords = keywords.map(
        (keyword) => {
          const updatedCustomerIDs =
            keyword.customerIDs.filter(
              (id) => id !== customerId,
            );
          return {
            id: keyword.id,
            customerIDs: updatedCustomerIDs,
          };
        },
      );

      await Promise.all(
        updatedKeywords.map((keyword) =>
          this.prisma.keyword.update({
            where: { id: keyword.id },
            data: {
              customerIDs: {
                set: keyword.customerIDs,
              },
            },
          }),
        ),
      );
    } catch (error) {
      throw new Error(
        `Could not remove customer from keywords: ${error.message}`,
      );
    }
  }

  async addCustomerToKeyword(
    keywordId: string,
    customerId: string,
  ): Promise<Keyword> {
    try {
      const keyword =
        await this.prisma.keyword.update({
          where: { id: keywordId },
          data: {
            customerIDs: { push: customerId },
          },
        });
      return keyword;
    } catch (error) {
      throw new Error(
        `Could not add customer with id ${customerId} to keyword with id ${keywordId}: ${error.message}`,
      );
    }
  }
}

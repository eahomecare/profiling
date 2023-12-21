import { Injectable } from '@nestjs/common';
import {
  Prisma,
  PrismaClient,
} from '@prisma/client';
import {
  ProfileTypeCustomerMapping,
  Keyword,
} from '@prisma/client';
import * as _ from 'lodash';
import { PrismaService } from '../prisma/prisma.service';
import { map } from 'rxjs';

@Injectable()
export class ProfileTypeCustomerMappingService {
  constructor(private prisma: PrismaService) { }

  async create(
    data: ProfileTypeCustomerMapping,
  ): Promise<ProfileTypeCustomerMapping> {
    return this.prisma.profileTypeCustomerMapping.create(
      { data },
    );
  }

  async findAll(): Promise<
    ProfileTypeCustomerMapping[]
  > {
    return this.prisma.profileTypeCustomerMapping.findMany();
  }

  // async findOne(id: string): Promise<ProfileTypeCustomerMapping | null> {
  //     return this.prisma.profileTypeCustomerMapping.findUnique({ where: { id } });
  // }

  async findAllByProfileTypeId(profileTypeId: string): Promise<any[]> {
    const profileTypeCustomerMappings = await this.prisma.profileTypeCustomerMapping.findMany({
      where: {
        profileTypeId,
        level: {
          gt: 1,
        },
      },

      include: {
        profileType: true,
        customer: {
          include: {
            personal_details: true,
          },
        }
      },
    });

    const flattenedResult = profileTypeCustomerMappings.map((mapping) => ({
      id: mapping.id,
      profileTypeId: mapping.profileTypeId,
      customerId: mapping.customerId,
      level: mapping.level,
      customerName: mapping.customer?.personal_details.full_name,
      email: mapping.customer.email,
      source: mapping.customer.source,
      profileTypeName: mapping.profileType.name
    }));

    return flattenedResult;
  }



  async update(
    id: string,
    data: ProfileTypeCustomerMapping,
  ): Promise<ProfileTypeCustomerMapping> {
    return this.prisma.profileTypeCustomerMapping.update(
      { where: { id }, data },
    );
  }

  async remove(id: string): Promise<void> {
    await this.prisma.profileTypeCustomerMapping.delete(
      { where: { id } },
    );
  }
  async getGroupedCountsByProfileTypeName(): Promise<
    { profileType: string; count: number }[]
  > {
    const profileTypeCustomerMappings =
      await this.prisma.profileTypeCustomerMapping.findMany({
        include: { profileType: true },
        where: {
          level: {
            gt: 1,
          },
        },
      });

    const groupedCounts = _.groupBy(
      profileTypeCustomerMappings,
      (mapping) => mapping.profileType.name,
    );
    const groupedCountsArray = _.map(
      groupedCounts,
      (group, profileType) => ({
        profileType,
        count: group.length,
      }),
    );

    return groupedCountsArray;
  }
  async getGroupedCountsByCustomerGender(): Promise<
    { gender: string; count: number }[]
  > {
    const profileTypeCustomerMappings =
      await this.prisma.profileTypeCustomerMapping.findMany({
        include: {
          customer: {
            include: {
              personal_details: true,
            },
          },
        },
        where: {
          level: {
            gt: 1,
          },
        },
      });

    const uniqueCustomerIds = new Set<string>();
    const groupedCounts: Record<string, number> = {};

    profileTypeCustomerMappings.forEach((mapping) => {
      const customerId = mapping.customer.id;
      if (!uniqueCustomerIds.has(customerId)) {
        uniqueCustomerIds.add(customerId);

        const gender =
          mapping.customer.personal_details?.gender || 'Unknown';
        groupedCounts[gender] = (groupedCounts[gender] || 0) + 1;
      }
    });

    const groupedCountsArray = Object.entries(groupedCounts).map(
      ([gender, count]) => ({
        gender,
        count,
      }),
    );

    return groupedCountsArray;
  }

  async getGroupedCountsByCustomerSource(): Promise<
    { source: string; count: number }[]
  > {
    const profileTypeCustomerMappings =
      await this.prisma.profileTypeCustomerMapping.findMany({
        include: { customer: true },
        where: {
          level: {
            gt: 1,
          },
        },
      });

    const uniqueCustomerIds = new Set<string>();
    const groupedCounts: Record<string, number> = {};

    profileTypeCustomerMappings.forEach((mapping) => {
      const customerId = mapping.customer.id;
      if (!uniqueCustomerIds.has(customerId)) {
        uniqueCustomerIds.add(customerId);

        const source = mapping.customer.source || 'Unknown';
        groupedCounts[source] = (groupedCounts[source] || 0) + 1;
      }
    });

    const groupedCountsArray = Object.entries(groupedCounts).map(
      ([source, count]) => ({
        source,
        count,
      }),
    );

    return groupedCountsArray;
  }




  async getGroupedCountsByCustomerAgeRange(): Promise<
    { ageRange: string; count: number }[]
  > {
    const currentDate = new Date();
    const ageRanges: {
      min: number;
      max: number;
      label: string;
    }[] = [
        { min: 0, max: 20, label: '0-20' },
        { min: 21, max: 25, label: '21-25' },
        { min: 26, max: 30, label: '26-30' },
        { min: 30, max: 35, label: '30-35' },
        { min: 36, max: 40, label: '36-40' },
        { min: 40, max: 45, label: '40-45' },
        { min: 46, max: 50, label: '46-50' },
        { min: 50, max: 55, label: '50-55' },
        { min: 56, max: 60, label: '56-60' },
        { min: 60, max: 65, label: '60-65' },
        { min: 66, max: 70, label: '66-70' },
      ];

    const groupedCounts: Record<string, number> =
      {};

    for (const range of ageRanges) {
      const minDOB = new Date(
        currentDate.getFullYear() - range.max,
        currentDate.getMonth(),
        currentDate.getDate(),
      );
      const maxDOB = new Date(
        currentDate.getFullYear() - range.min,
        currentDate.getMonth(),
        currentDate.getDate(),
      );

      const formatDate = (date: Date) => {
        return date.toISOString();
      };

      const uniqueCustomerIds = new Set<string>();
      const profileTypeCustomerMappings =
        await this.prisma.profileTypeCustomerMapping.findMany({
          where: {
            customer: {
              personal_details: {
                date_of_birth: {
                  gte: formatDate(minDOB),
                  lte: formatDate(maxDOB),
                },
              },
            },
            level: {
              gt: 1,
            },
          },
        });



      profileTypeCustomerMappings.forEach(
        (mapping) => {
          const customerId = mapping.customerId;
          if (
            !uniqueCustomerIds.has(customerId)
          ) {
            uniqueCustomerIds.add(customerId);
            groupedCounts[range.label] =
              (groupedCounts[range.label] || 0) +
              1;
          }
        },
      );
    }

    const groupedCountsArray = Object.entries(
      groupedCounts,
    ).map(([ageRange, count]) => ({
      ageRange,
      count,
    }));

    return groupedCountsArray;
  }

  async getCustomersByGenderForProfileTypeCustomerMappings(
    gender: string,
  ) {
    try {
      const customers =
        await this.prisma.profileTypeCustomerMapping.findMany(
          {
            where: {
              customer: {
                personal_details: {
                  gender: {
                    equals: gender,
                  },
                },
              },
            },
          },
        );

      return customers;
    } catch (error) {
      console.error(
        'Error fetching customers by gender:',
        error,
      );
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async getCustomersByAgeRangeForProfileTypeCustomerMappings(
    ageRange: string,
  ) {
    try {
      const currentDate = new Date();
      const minAge = parseInt(
        ageRange.split('-')[0],
      );
      const maxAge = parseInt(
        ageRange.split('-')[1],
      );

      const minDOB = new Date(
        currentDate.getFullYear() - maxAge,
        currentDate.getMonth(),
        currentDate.getDate(),
      );
      const maxDOB = new Date(
        currentDate.getFullYear() - minAge,
        currentDate.getMonth(),
        currentDate.getDate(),
      );

      const formatDate = (date: Date) => {
        return date.toISOString();
      };

      const customers =
        await this.prisma.profileTypeCustomerMapping.findMany(
          {
            where: {
              customer: {
                personal_details: {
                  date_of_birth: {
                    gte: formatDate(minDOB),
                    lte: formatDate(maxDOB),
                  },
                },
              },
            },
          },
        );

      return customers;
    } catch (error) {
      console.error(
        'Error fetching customers by age range:',
        error,
      );
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async updateProfileTypeCustomerMappingGeneric(
    customerId: string,
  ): Promise<ProfileTypeCustomerMapping[]> {
    const profilingTypeStandard = 99;

    const keywords =
      await this.prisma.keyword.findMany({
        where: {
          customerIDs: {
            has: customerId,
          },
          category: {
            not: 'unknown',
          },
        },
      });

    const categoryAverageLevels =
      this.calculateCategoryNonLinearLevels(
        keywords,
      );

    const profileTypeMappings =
      await this.prisma.profileTypeCustomerMapping.findMany(
        {
          where: {
            customerId,
          },
          include: { profileType: true },
        },
      );

    const updatedMappings = await Promise.all(
      profileTypeMappings.map(async (mapping) => {
        const category =
          mapping.profileType.category;
        const averageLevel =
          categoryAverageLevels[category] || 0;
        console.log(
          'Average level in ',
          category,
          averageLevel,
        );

        const newLevel =
          averageLevel > profilingTypeStandard
            ? 2
            : 1;

        const updatedMapping =
          await this.prisma.profileTypeCustomerMapping.update(
            {
              where: {
                id: mapping.id,
              },
              data: {
                level: newLevel,
              },
            },
          );

        return {
          id: updatedMapping.id,
          customerId: updatedMapping.customerId,
          profileTypeId:
            updatedMapping.profileTypeId,
          level: updatedMapping.level,
        };
      }),
    );

    return updatedMappings;
  }

  private calculateCategoryNonLinearLevels(
    keywords: Keyword[],
  ): { [category: string]: number } {
    const categoryTotals: {
      [category: string]: {
        sum: number;
        count: number;
      };
    } = {};

    const scalingFactor = 2;

    keywords.forEach((keyword) => {
      if (!categoryTotals[keyword.category]) {
        categoryTotals[keyword.category] = {
          sum: 0,
          count: 0,
        };
      }

      const scaledLevel = Math.pow(
        scalingFactor,
        keyword.level,
      );
      categoryTotals[keyword.category].sum +=
        scaledLevel;
      categoryTotals[keyword.category].count++;
    });

    const categoryScores: {
      [category: string]: number;
    } = {};

    for (const category in categoryTotals) {
      const { sum, count } =
        categoryTotals[category];
      categoryScores[category] = sum * count;
    }

    return categoryScores;
  }

  private calculateCategoryAverageLevels(
    keywords: Keyword[],
  ): { [category: string]: number } {
    const categoryTotals: {
      [category: string]: {
        sum: number;
        count: number;
      };
    } = {};

    keywords.forEach((keyword) => {
      if (!categoryTotals[keyword.category]) {
        categoryTotals[keyword.category] = {
          sum: 0,
          count: 0,
        };
      }

      categoryTotals[keyword.category].sum +=
        keyword.level;
      categoryTotals[keyword.category].count++;
    });

    const categoryAverageLevels: {
      [category: string]: number;
    } = {};

    for (const category in categoryTotals) {
      const { sum, count } =
        categoryTotals[category];
      categoryAverageLevels[category] =
        sum / count;
    }

    return categoryAverageLevels;
  }

  async getCustomerMappingByCustomerId(
    customerId: string,
  ): Promise<ProfileTypeCustomerMapping[]> {
    try {
      const nameMapping = {
        food: 'Foodie',
        technology: 'Techie',
        gadget: 'Gadget Freak',
        sports: 'Sports Fan',
        automobile: 'Auto Lover',
        fitness: 'Fitness Freak',
        travel: 'Avid Traveller',
        music: 'Musicophile',
      };

      const customerMappings =
        await this.prisma.profileTypeCustomerMapping.findMany(
          {
            include: {
              profileType: true,
              customer: {
                include: {
                  keywords: true,
                },
              },
            },
            where: {
              customerId: customerId,
              level: {
                gt: 1,
              },
            },
          },
        );

      const mappedCustomerMappings =
        customerMappings.map((mapping) => {
          const profileCompletion =
            this.calculateProfileCompletion(
              mapping.customer.keywords,
              mapping.profileType.name,
            );

          return {
            ...mapping,
            profileType: {
              ...mapping.profileType,
              name:
                nameMapping[
                mapping.profileType.name
                ] || mapping.profileType.name,
            },
            profileCompletion,
          };
        });

      return mappedCustomerMappings;
    } catch (error) {
      console.error(
        'Error fetching customer mapping by customer ID:',
        error,
      );
      throw error;
    }
  }

  private calculateProfileCompletion = (
    keywords: Keyword[],
    profileName: string,
  ): number => {
    let totalLevel = 0;
    const relevantKeywords = keywords.filter(
      (keyword) =>
        keyword.category === profileName,
    );

    relevantKeywords.forEach((keyword) => {
      totalLevel += keyword.level ?? 0;
    });

    const profileCompletion =
      (totalLevel / 50) * 100;
    return profileCompletion > 100
      ? 100
      : profileCompletion;
  };
}

import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ProfileTypeCustomerMapping, Keyword } from '@prisma/client';
import * as _ from 'lodash';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class ProfileTypeCustomerMappingService {
    constructor(private prisma: PrismaService) { }

    async create(data: ProfileTypeCustomerMapping): Promise<ProfileTypeCustomerMapping> {
        return this.prisma.profileTypeCustomerMapping.create({ data });
    }

    async findAll(): Promise<ProfileTypeCustomerMapping[]> {
        return this.prisma.profileTypeCustomerMapping.findMany();
    }

    // async findOne(id: string): Promise<ProfileTypeCustomerMapping | null> {
    //     return this.prisma.profileTypeCustomerMapping.findUnique({ where: { id } });
    // }

    async update(id: string, data: ProfileTypeCustomerMapping): Promise<ProfileTypeCustomerMapping> {
        return this.prisma.profileTypeCustomerMapping.update({ where: { id }, data });
    }

    async remove(id: string): Promise<void> {
        await this.prisma.profileTypeCustomerMapping.delete({ where: { id } });
    }
    async getGroupedCountsByProfileTypeName(): Promise<{ profileType: string; count: number }[]> {
        const profileTypeCustomerMappings = await this.prisma.profileTypeCustomerMapping.findMany({ include: { profileType: true } });
        const groupedCounts = _.groupBy(profileTypeCustomerMappings, (mapping) => mapping.profileType.name);
        const groupedCountsArray = _.map(groupedCounts, (group, profileType) => ({
            profileType,
            count: group.length,
        }));

        return groupedCountsArray;
    }

    async getGroupedCountsByCustomerGender(): Promise<{ gender: string; count: number }[]> {
        const profileTypeCustomerMappings = await this.prisma.profileTypeCustomerMapping.findMany({
            include: {
                customer: {
                    include: {
                        personal_details: true,
                    },
                },
            },
        });

        const uniqueCustomerIds = new Set<string>();
        const groupedCounts: Record<string, number> = {};

        profileTypeCustomerMappings.forEach((mapping) => {
            const customerId = mapping.customer.id;
            if (!uniqueCustomerIds.has(customerId)) {
                uniqueCustomerIds.add(customerId);

                const gender = mapping.customer.personal_details?.gender || 'Unknown';
                groupedCounts[gender] = (groupedCounts[gender] || 0) + 1;
            }
        });

        const groupedCountsArray = Object.entries(groupedCounts).map(([gender, count]) => ({
            gender,
            count,
        }));

        return groupedCountsArray;
    }

    async getGroupedCountsByCustomerSource(): Promise<{ source: string; count: number }[]> {
        const profileTypeCustomerMappings = await this.prisma.profileTypeCustomerMapping.findMany({ include: { customer: true } });

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

        const groupedCountsArray = Object.entries(groupedCounts).map(([source, count]) => ({
            source,
            count,
        }));

        return groupedCountsArray;
    }





    async getGroupedCountsByCustomerAgeRange(): Promise<{ ageRange: string; count: number }[]> {
        const currentDate = new Date();
        const ageRanges: { min: number; max: number; label: string }[] = [
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

        const groupedCounts: Record<string, number> = {};

        for (const range of ageRanges) {
            const minDOB = new Date(
                currentDate.getFullYear() - range.max,
                currentDate.getMonth(),
                currentDate.getDate()
            );
            const maxDOB = new Date(
                currentDate.getFullYear() - range.min,
                currentDate.getMonth(),
                currentDate.getDate()
            );

            const formatDate = (date: Date) => {
                return date.toISOString();
            };

            const uniqueCustomerIds = new Set<string>();
            const profileTypeCustomerMappings = await this.prisma.profileTypeCustomerMapping.findMany({
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
            });

            profileTypeCustomerMappings.forEach((mapping) => {
                const customerId = mapping.customerId;
                if (!uniqueCustomerIds.has(customerId)) {
                    uniqueCustomerIds.add(customerId);
                    groupedCounts[range.label] = (groupedCounts[range.label] || 0) + 1;
                }
            });
        }

        const groupedCountsArray = Object.entries(groupedCounts).map(([ageRange, count]) => ({
            ageRange,
            count,
        }));

        return groupedCountsArray;
    }


    async getCustomersByGenderForProfileTypeCustomerMappings(gender: string) {
        try {
            const customers = await this.prisma.profileTypeCustomerMapping.findMany({
                where: {
                    customer: {
                        personal_details: {
                            gender: {
                                equals: gender,
                            },
                        },
                    },
                },
            });

            return customers;
        } catch (error) {
            console.error('Error fetching customers by gender:', error);
            throw error;
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async getCustomersByAgeRangeForProfileTypeCustomerMappings(ageRange: string) {
        try {
            const currentDate = new Date();
            const minAge = parseInt(ageRange.split('-')[0]);
            const maxAge = parseInt(ageRange.split('-')[1]);

            const minDOB = new Date(
                currentDate.getFullYear() - maxAge,
                currentDate.getMonth(),
                currentDate.getDate()
            );
            const maxDOB = new Date(
                currentDate.getFullYear() - minAge,
                currentDate.getMonth(),
                currentDate.getDate()
            );

            const formatDate = (date: Date) => {
                return date.toISOString();
            };

            const customers = await this.prisma.profileTypeCustomerMapping.findMany({
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
            });

            return customers;
        } catch (error) {
            console.error('Error fetching customers by age range:', error);
            throw error;
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async updateProfileTypeCustomerMappingGeneric(customerId: string): Promise<ProfileTypeCustomerMapping[]> {
        const keywords = await this.prisma.keyword.findMany({
            where: {
                customerIDs: {
                    has: customerId,
                },
                category: {
                    not: 'unknown',
                },
            },
        });

        const categoryAverageLevels = this.calculateCategoryAverageLevels(keywords);

        const profileTypeMappings = await this.prisma.profileTypeCustomerMapping.findMany({
            where: {
                customerId,
            },
            include: { profileType: true },
        });

        const updatedMappings = await Promise.all(profileTypeMappings.map(async (mapping) => {
            const category = mapping.profileType.category;
            const averageLevel = categoryAverageLevels[category] || 1;

            const updatedMapping = await this.prisma.profileTypeCustomerMapping.update({
                where: {
                    id: mapping.id,
                },
                data: {
                    level: averageLevel,
                },
            });

            return {
                id: updatedMapping.id,
                customerId: updatedMapping.customerId,
                profileTypeId: updatedMapping.profileTypeId,
                level: updatedMapping.level,
            };
        }));

        return updatedMappings;
    }


    private calculateCategoryAverageLevels(keywords: Keyword[]): { [category: string]: number } {
        const categoryTotals: { [category: string]: { sum: number; count: number } } = {};

        keywords.forEach((keyword) => {
            if (!categoryTotals[keyword.category]) {
                categoryTotals[keyword.category] = { sum: 0, count: 0 };
            }

            categoryTotals[keyword.category].sum += keyword.level;
            categoryTotals[keyword.category].count++;
        });

        const categoryAverageLevels: { [category: string]: number } = {};

        for (const category in categoryTotals) {
            const { sum, count } = categoryTotals[category];
            categoryAverageLevels[category] = sum / count;
        }

        return categoryAverageLevels;
    }


}

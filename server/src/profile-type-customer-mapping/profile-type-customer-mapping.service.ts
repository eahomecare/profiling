import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ProfileTypeCustomerMapping } from '@prisma/client';
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

    async findOne(id: string): Promise<ProfileTypeCustomerMapping | null> {
        return this.prisma.profileTypeCustomerMapping.findUnique({ where: { id } });
    }

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


}

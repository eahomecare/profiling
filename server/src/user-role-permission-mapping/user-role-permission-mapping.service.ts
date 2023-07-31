import { Injectable } from '@nestjs/common';
import { Prisma, userRolePermissionMapping } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRolePermissionMappingService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.userRolePermissionMappingCreateInput): Promise<userRolePermissionMapping> {
        try {
            const createdMapping = await this.prisma.userRolePermissionMapping.create({
                data,
            });
            return createdMapping;
        } catch (error) {
            throw new Error('Failed to create userRolePermissionMapping');
        }
    }

    async findAll(): Promise<userRolePermissionMapping[]> {
        try {
            const mappings = await this.prisma.userRolePermissionMapping.findMany();
            return mappings;
        } catch (error) {
            throw new Error('Failed to fetch userRolePermissionMappings');
        }
    }

    async findMappingsByUserId(userId: string): Promise<userRolePermissionMapping[]> {
        try {
            const mappings = await this.prisma.userRolePermissionMapping.findMany({
                where: {
                    userId,
                },
            });
            return mappings;
        } catch (error) {
            throw new Error('Failed to fetch userRolePermissionMappings by userId');
        }
    }

    async findMappingsByRoleId(roleId: string): Promise<userRolePermissionMapping[]> {
        try {
            const mappings = await this.prisma.userRolePermissionMapping.findMany({
                where: {
                    roleId,
                },
            });
            return mappings;
        } catch (error) {
            throw new Error('Failed to fetch userRolePermissionMappings by roleId');
        }
    }
}

import { Injectable } from '@nestjs/common';
import { Role, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.RoleCreateInput): Promise<Role> {
        try {
            const createdRole = await this.prisma.role.create({
                data,
            });
            return createdRole;
        } catch (error) {
            throw new Error('Failed to create role');
        }
    }

    async findAll(): Promise<Role[]> {
        try {
            const roles = await this.prisma.role.findMany();
            return roles;
        } catch (error) {
            throw new Error('Failed to fetch roles');
        }
    }

    async findRolesByUserId(userId: string): Promise<Role[]> {
        try {
            const roles = await this.prisma.role.findMany({
                where: {
                    userRolePermissionMapping: {
                        some: {
                            userId,
                        },
                    },
                },
            });
            return roles;
        } catch (error) {
            throw new Error('Failed to fetch roles by userId');
        }
    }

    async findUsersByRoleId(roleId: string): Promise<any[]> {
        try {
            const users = await this.prisma.user.findMany({
                where: {
                    userRolePermissionMapping: {
                        some: {
                            roleId,
                        },
                    },
                },
            });
            return users;
        } catch (error) {
            throw new Error('Failed to fetch users by roleId');
        }
    }
}

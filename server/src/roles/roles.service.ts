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
            // Handle error, e.g., logging, throwing custom exception, etc.
            throw new Error('Failed to create role');
        }
    }

    async findAll(): Promise<Role[]> {
        try {
            const roles = await this.prisma.role.findMany();
            return roles;
        } catch (error) {
            // Handle error, e.g., logging, throwing custom exception, etc.
            throw new Error('Failed to fetch roles');
        }
    }

    async findAllRolesOfUser(userId: string): Promise<Role[]> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    userRolePermissionMapping: {
                        include: {
                            role: true,
                        },
                    },
                },
            });

            if (!user) {
                // Handle case when the user is not found
                throw new Error('User not found');
            }

            const roles = user.userRolePermissionMapping.map((mapping) => mapping.role);
            return roles;
        } catch (error) {
            // Handle error, e.g., logging, throwing custom exception, etc.
            throw new Error('Failed to fetch roles of user');
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
            // Handle error, e.g., logging, throwing custom exception, etc.
            throw new Error('Failed to fetch roles by userId');
        }
    }
}

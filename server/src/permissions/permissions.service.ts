import { Injectable } from '@nestjs/common';
import { Permission, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.PermissionCreateInput): Promise<Permission> {
    try {
      const createdPermission = await this.prisma.permission.create({
        data,
      });
      return createdPermission;
    } catch (error) {
      throw new Error('Failed to create permission');
    }
  }

  async findAll(): Promise<Permission[]> {
    try {
      const permissions = await this.prisma.permission.findMany();
      return permissions;
    } catch (error) {
      throw new Error('Failed to fetch permissions');
    }
  }

  async findAllPermissionsOfUser(userId: string): Promise<Permission[]> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          userRolePermissionMapping: {
            include: {
              permission: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const permissions = user.userRolePermissionMapping.map((mapping) => mapping.permission);
      return permissions;
    } catch (error) {
      throw new Error('Failed to fetch permissions of user');
    }
  }

  async findPermissionsByUserId(userId: string): Promise<Permission[]> {
    try {
      const permissions = await this.prisma.permission.findMany({
        where: {
          userRolePermissionMapping: {
            some: {
              userId,
            },
          },
        },
      });
      return permissions;
    } catch (error) {
      throw new Error('Failed to fetch permissions by userId');
    }
  }
}

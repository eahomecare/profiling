import { Injectable } from '@nestjs/common';
import { Permission, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(
    private prisma: PrismaService
  ) { }

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

  async findUsersByPermissionId(permissionId: string): Promise<any[]> {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          userRolePermissionMapping: {
            some: {
              permissionId,
            },
          },
        },
      });
      return users;
    } catch (error) {
      throw new Error('Failed to fetch users by permissionId');
    }
  }

  async updateDefaultRoles(permissionId: string, roleIds: string[]): Promise<Permission> {
    try {
      const updatedPermission = await this.prisma.permission.update({
        where: { id: permissionId },
        data: {
          defaultRolesIDs: { set: roleIds },
        },
        include: {
          defaultRoles: true,
        },
      });

      const roleUpdatePromises = updatedPermission.defaultRoles.map((role) => {
        return this.prisma.role.update({
          where: { id: role.id },
          data: {
            defaultPermissionsIDs: {
              set: updatedPermission.id,
            },
          },
        });
      });
      await Promise.all(roleUpdatePromises);

      return updatedPermission;
    } catch (error) {
      throw new Error('Failed to update permission defaultRolesIDs');
    }
  }

  async findPermissionsByRoleId(roleId: string): Promise<Permission[]> {
    try {
      const permissions = await this.prisma.permission.findMany({
        where: {
          defaultRolesIDs: {
            has: roleId,
          },
        },
      });
      return permissions;
    } catch (error) {
      throw new Error('Failed to fetch permissions by roleId');
    }
  }


}











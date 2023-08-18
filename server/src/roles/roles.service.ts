import { Injectable } from '@nestjs/common';
import { Role, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.RoleCreateInput,
  ): Promise<Role> {
    try {
      const createdRole =
        await this.prisma.role.create({
          data,
        });
      return createdRole;
    } catch (error) {
      throw new Error('Failed to create role');
    }
  }

  async findAll(): Promise<Role[]> {
    try {
      const roles =
        await this.prisma.role.findMany();
      return roles;
    } catch (error) {
      throw new Error('Failed to fetch roles');
    }
  }

  async findRolesByUserId(
    userId: string,
  ): Promise<Role[]> {
    try {
      const roles =
        await this.prisma.role.findMany({
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
      throw new Error(
        'Failed to fetch roles by userId',
      );
    }
  }

  async findUsersByRoleId(
    roleId: string,
  ): Promise<any[]> {
    try {
      const users =
        await this.prisma.user.findMany({
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
      throw new Error(
        'Failed to fetch users by roleId',
      );
    }
  }

  async updateDefaultPermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<Role> {
    try {
      const updatedRole =
        await this.prisma.role.update({
          where: { id: roleId },
          data: {
            defaultPermissionsIDs: {
              push: permissionIds,
            },
          },
          include: {
            defaultPermissions: true,
          },
        });

      const permissionUpdatePromises =
        updatedRole.defaultPermissions.map(
          (permission) => {
            return this.prisma.permission.update({
              where: { id: permission.id },
              data: {
                defaultRolesIDs: {
                  push: updatedRole.id,
                },
              },
            });
          },
        );
      await Promise.all(permissionUpdatePromises);

      return updatedRole;
    } catch (error) {
      console.log(error);

      throw new Error(
        'Failed to update role defaultPermissionsIDs',
      );
    }
  }
}

import { Injectable } from '@nestjs/common';
import {
  Prisma,
  userRolePermissionMapping,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRolePermissionMappingService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.userRolePermissionMappingCreateInput,
  ): Promise<userRolePermissionMapping> {
    try {
      const createdMapping =
        await this.prisma.userRolePermissionMapping.create(
          {
            data,
          },
        );

      const foundMapping =
        await this.prisma.userRolePermissionMapping.findUnique(
          {
            where: { id: createdMapping.id },
            include: {
              role: true,
              user: true,
              permission: true,
            },
          },
        );

      return foundMapping;
    } catch (error) {
      throw new Error(
        'Failed to create userRolePermissionMapping',
      );
    }
  }

  async findAll(): Promise<
    userRolePermissionMapping[]
  > {
    try {
      const mappings =
        await this.prisma.userRolePermissionMapping.findMany(
          {
            include: {
              role: true,
              user: true,
              permission: true,
            },
          },
        );
        return mappings.filter(mapping => mapping.user && mapping.role && mapping.permission);
    } catch (error) {
      console.log(error);
      
      throw new Error(
        'Failed to fetch userRolePermissionMappings',
      );
    }
  }

  async findMappingsByUserId(
    userId: string,
  ): Promise<userRolePermissionMapping[]> {
    try {
      const mappings =
        await this.prisma.userRolePermissionMapping.findMany(
          {
            where: {
              userId,
            },
            include: {
              role: true,
              permission: true,
            },
          },
        );
      return mappings;
    } catch (error) {
      console.log(error);

      throw new Error(
        'Failed to fetch userRolePermissionMappings by userId',
      );
    }
  }

  async findMappingsByRoleId(
    roleId: string,
  ): Promise<userRolePermissionMapping[]> {
    try {
      const mappings =
        await this.prisma.userRolePermissionMapping.findMany(
          {
            where: {
              roleId,
            },
          },
        );
      return mappings;
    } catch (error) {
      throw new Error(
        'Failed to fetch userRolePermissionMappings by roleId',
      );
    }
  }

  async deactivateMapping(id: string): Promise<userRolePermissionMapping | null> {
    try {
      const mapping = await this.prisma.userRolePermissionMapping.findUnique({
        where: {
          id,
        },
      });

      if (!mapping) {
        return null;
      }

      const updatedMapping = await this.prisma.userRolePermissionMapping.update({
        where: {
          id,
        },
        data: {
          isActive: mapping.isActive? false : true,
        },
      });

      return updatedMapping;
    } catch (error) {
      throw new Error('Failed to deactivate userRolePermissionMapping');
    }
  }
}

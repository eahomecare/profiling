import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { User, Prisma } from '@prisma/client';
import { UserRolePermissionMappingService } from '../user-role-permission-mapping/user-role-permission-mapping.service'
import { PermissionsService } from '../permissions/permissions.service';
import * as argon from 'argon2';


@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private userRolePermissionMappingService: UserRolePermissionMappingService,
    private permissionsService: PermissionsService
  ) { }

  async createUser(data) {
    try {
      const { fullname, email, mobile, roleId } = data;
      const hash = await argon.hash("homecare@123");

      const createdUser = await this.prisma.user.create({
        data: {
          email,
          hash,
          mobile,
          fullname,
          role: {
            connect: { id: roleId },
          },
        },
      });

      const found_role = await this.prisma.role.findUnique({
        where: {
          id: roleId,
        },
      })

      let permissions;
      if (found_role.name == 'superadmin') {
        permissions = await this.prisma.permission.findMany()
      } else {
        permissions = await this.permissionsService.findPermissionsByRoleId(roleId);
      }
      const mappingIds = [];

      for (const permission of permissions) {
        const mappingData = {
          userId: createdUser.id,
          roleId: roleId,
          permissionId: permission.id,
        };

        const mapping = await this.prisma.userRolePermissionMapping.create({
          data: mappingData,
        });

        mappingIds.push(mapping.id);
      }

      await this.prisma.user.update({
        where: { id: createdUser.id },
        data: {
          userRolePermissionMapping: {
            connect: mappingIds.map((id) => ({ id })),
          },
        },
      });

      const updatedUser = await this.prisma.user.findUnique({
        where: {
          id: createdUser.id,
        }, include: { role: true }
      });

      return updatedUser;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to create user');
    }
  }



  async editUser(
    userId: string,
    dto: EditUserDto,
  ) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash;

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users =
        await this.prisma.user.findMany({
          include: { role: true },
        });
      return users;
    } catch (error) {
      console.log(error);

      throw new Error('Failed to fetch users');
    }
  }
}

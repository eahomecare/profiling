import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { User,Prisma } from '@prisma/client';
import { UserRolePermissionMappingService } from '../user-role-permission-mapping/user-role-permission-mapping.service'
import { PermissionsService } from '../permissions/permissions.service';
import * as argon from 'argon2';


@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private userRolePermissionMappingService:UserRolePermissionMappingService,
    private permissionsService:PermissionsService
    ) {}

    async createUser(data) {
      try {
        const {  fullname, email, mobile,roleId } = data;
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
    
        const permissions = await this.permissionsService.findPermissionsByRoleId(roleId);

       
    
        for (const permission of permissions) {
          const data = {
            "userId": createdUser.id,
            "roleId": roleId,
            "permissionId": permission.id
            }
          await this.prisma.userRolePermissionMapping.create({
            data,
          })
        }
    
        return createdUser;
      } catch (error) {
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

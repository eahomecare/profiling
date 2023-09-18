import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) { }

  // async signup(email: string, password: string, roleName: string) {
  //   const hash = await argon.hash(password);
  //   const role = await this.prisma.role.findUnique({
  //     where: {
  //       name: roleName,
  //     },
  //     include: {
  //       defaultPermissions: true,
  //     },
  //   });

  //   if (!role) {
  //     throw new ForbiddenException('Role not found');
  //   }

  //   try {
  //     const user = await this.prisma.user.create({
  //       data: {
  //         email,
  //         hash,
  //         role: {
  //           connect: { id: role.id },
  //         },
  //       },
  //     });

  //     const permissionRoleMappingPromises = role.defaultPermissions.map(async (permission) => {
  //       await this.prisma.userRolePermissionMapping.create({
  //         data: {
  //           roleId: role.id,
  //           userId: user.id,
  //           permissionId: permission.id,
  //         },
  //       });
  //     });

  //     await Promise.all(permissionRoleMappingPromises);

  //     return this.signToken(user.id, user.email);
  //   } catch (error) {
  //     if (error instanceof PrismaClientKnownRequestError) {
  //       if (error.code === 'P2002') {
  //         throw new ForbiddenException('Credentials taken');
  //       }
  //     }
  //     throw error;
  //   }
  // }


  async signin(email: string, password: string) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
    if (!user)
      throw new ForbiddenException(
        'Credentials incorrect',
      );

    const pwMatches = await argon.verify(
      user.hash,
      password,
    );
    if (!pwMatches)
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '1h',
        secret: secret,
      },
    );

    return {
      access_token: token,
    };
  }
}

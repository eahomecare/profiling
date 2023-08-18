import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfileTypeDto } from './dto/create-profile-type.dto';
import { UpdateProfileTypeDto } from './dto/update-profile-type.dto';

@Injectable()
export class ProfileTypesService {
  constructor(private prisma: PrismaService) {}

  async createProfileType(
    data: CreateProfileTypeDto,
  ) {
    return this.prisma.profileType.create({
      data,
    });
  }

  async updateProfileType(
    id: string,
    data: UpdateProfileTypeDto,
  ) {
    const profileType =
      await this.prisma.profileType.update({
        where: { id },
        data,
      });

    console.log('updated profile', profileType);

    if (!profileType) {
      throw new NotFoundException(
        `Profile Type with ID ${id} not found`,
      );
    }

    return profileType;
  }
}

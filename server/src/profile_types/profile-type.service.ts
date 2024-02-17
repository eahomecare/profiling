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

  async onModuleInit() {
    await this.initProfileTypes();
  }

  private async initProfileTypes() {
    const count =
      await this.prisma.profileType.count();
    if (count === 0) {
      const initialProfileTypes: CreateProfileTypeDto[] =
        [
          {
            name: 'food',
            category: 'food',
            srcUrl: 'test',
            description: null,
          },
          {
            name: 'sports',
            category: 'sports',
            srcUrl: null,
            description: null,
          },
          {
            name: 'travel',
            category: 'travel',
            srcUrl: null,
            description: null,
          },
          {
            name: 'music',
            category: 'music',
            srcUrl: null,
            description: null,
          },
          {
            name: 'fitness',
            category: 'fitness',
            srcUrl: null,
            description: null,
          },
          {
            name: 'automobile',
            category: 'automobile',
            srcUrl: null,
            description: null,
          },
          {
            name: 'gadget',
            category: 'gadget',
            srcUrl: null,
            description: null,
          },
          {
            name: 'technology',
            category: 'technology',
            srcUrl: null,
            description: null,
          },
        ];

      await Promise.all(
        initialProfileTypes.map((type) =>
          this.createProfileType(type),
        ),
      );
    }
  }

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

  async getAllProfileTypes() {
    return this.prisma.profileType.findMany();
  }
}

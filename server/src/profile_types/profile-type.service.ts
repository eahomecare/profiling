import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfileTypeDto } from './dto/create-profile-type.dto';
import { UpdateProfileTypeDto } from './dto/update-profile-type.dto';

@Injectable()
export class ProfileTypesService {
  private readonly logger = new Logger(
    ProfileTypesService.name,
  );

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    this.logger.log(
      'Initializing profile types...',
    );
    await this.initProfileTypes();
  }

  private async initProfileTypes() {
    const count =
      await this.prisma.profileType.count();
    if (count === 0) {
      this.logger.log(
        'No existing profile types found, initializing with defaults...',
      );
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
    try {
      this.logger.log(
        `Creating a new profile type: ${data.name}`,
      );
      return await this.prisma.profileType.create(
        { data },
      );
    } catch (error) {
      this.logger.error(
        `Failed to create profile type: ${data.name}, Error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateProfileType(
    id: string,
    data: UpdateProfileTypeDto,
  ) {
    try {
      const profileType =
        await this.prisma.profileType.update({
          where: { id },
          data,
        });
      this.logger.log(
        `Updated profile type with ID ${id}`,
      );
      return profileType;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(
          `Profile Type with ID ${id} not found`,
        );
      } else {
        this.logger.error(
          `Failed to update profile type with ID ${id}: ${error.message}`,
          error.stack,
        );
      }
      throw error;
    }
  }

  async getAllProfileTypes() {
    try {
      this.logger.log(
        'Fetching all profile types',
      );
      return await this.prisma.profileType.findMany();
    } catch (error) {
      this.logger.error(
        `Failed to fetch all profile types: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}

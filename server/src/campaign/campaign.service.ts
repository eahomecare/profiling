import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Campaign, Prisma } from '@prisma/client';

@Injectable()
export class CampaignService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(): Promise<Campaign[]> {
    return this.prisma.campaign.findMany({
      include: { events: true, template: true },
    });
  }

  async findOne(
    id: string,
  ): Promise<Campaign | null> {
    return this.prisma.campaign.findUnique({
      where: { id },
    });
  }

  async create(
    data: Prisma.CampaignCreateInput,
  ): Promise<Campaign> {
    try {
      data.start = new Date(data.start);
      data.end = new Date(data.end);
      const createdCampaign =
        await this.prisma.campaign.create({
          data,
        });
      return createdCampaign;
    } catch (error) {
      throw new Error(
        'Failed to create permission',
      );
    }
  }
}

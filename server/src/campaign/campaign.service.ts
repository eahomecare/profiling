// src/campaign/campaign.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Campaign } from '@prisma/client';

@Injectable()
export class CampaignService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<Campaign[]> {
        return this.prisma.campaign.findMany();
    }

    async findOne(id: number): Promise<Campaign | null> {
        return this.prisma.campaign.findUnique({
            where: { id },
        });
    }

    async create(data: Partial<Campaign>): Promise<Campaign> {
        return this.prisma.campaign.create({
            data,
        });
    }

    async update(id: number, data: Partial<Campaign>): Promise<Campaign | null> {
        return this.prisma.campaign.update({
            where: { id },
            data,
        });
    }

    async remove(id: number): Promise<void> {
        await this.prisma.campaign.delete({
            where: { id },
        });
    }
}

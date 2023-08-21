// src/campaign/campaign.controller.ts

import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { Campaign } from '@prisma/client';

@Controller('campaign')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService) { }

    @Get()
    async findAll(): Promise<Campaign[]> {
        return this.campaignService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Campaign | null> {
        return this.campaignService.findOne(id);
    }

    @Post()
    async create(@Body() data: Partial<Campaign>): Promise<Campaign> {
        return this.campaignService.create(data);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() data: Partial<Campaign>): Promise<Campaign | null> {
        return this.campaignService.update(id, data);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void> {
        return this.campaignService.remove(id);
    }
}

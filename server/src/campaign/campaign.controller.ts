// src/campaign/campaign.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { Campaign, Prisma } from '@prisma/client';

@Controller('campaign')
export class CampaignController {
  constructor(
    private readonly campaignService: CampaignService,
  ) {}

  @Get()
  async getAllCampaign(): Promise<Campaign[]> {
    return this.campaignService.findAll();
  }

  @Get(':id')
  async getCampaignById(
    @Param('id') id: string,
  ): Promise<Campaign> {
    return this.campaignService.findOne(id);
  }

  @Post()
  async create(
    @Body() data: Prisma.CampaignCreateInput,
  ): Promise<Campaign> {
    return this.campaignService.create(data);
  }

  @Get('reports/all')
  async getCampaignReports(): Promise<any[]> {
    return this.campaignService.getCampaignReports();
  }
}

import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { Vehicle_Detail } from '@prisma/client';
import { Vehicle_DetailService } from './vehicle_detail.service';

@Controller('vehicle_details')
export class Vehicle_DetailController {
  constructor(private readonly vehicle_detailService: Vehicle_DetailService) {}

  @Post()
  create(@Body() data: Omit<Vehicle_Detail, 'id'>): Promise<Vehicle_Detail> {
    return this.vehicle_detailService.create(data);
  }

  @Get()
  findAll(): Promise<Vehicle_Detail[]> {
    return this.vehicle_detailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Vehicle_Detail | null> {
    return this.vehicle_detailService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: Partial<Omit<Vehicle_Detail, 'id'>>,
  ): Promise<Vehicle_Detail | null> {
    return this.vehicle_detailService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Vehicle_Detail | null> {
    return this.vehicle_detailService.remove(id);
  }
}

import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { OccupationService } from './occupation.service';
import { Occupation } from '@prisma/client';

@Controller('occupations')
export class OccupationController {
  constructor(private readonly occupationService: OccupationService) {}

  @Post()
  create(@Body() data: Omit<Occupation, 'id'>): Promise<Occupation> {
    return this.occupationService.create(data);
  }

  @Get()
  findAll(): Promise<Occupation[]> {
    return this.occupationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Occupation | null> {
    return this.occupationService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: Partial<Omit<Occupation, 'id'>>,
  ): Promise<Occupation | null> {
    return this.occupationService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Occupation | null> {
    return this.occupationService.remove(id);
  }
}

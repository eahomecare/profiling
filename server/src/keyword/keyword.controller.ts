import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { Keyword } from '@prisma/client';

@Controller('keyword')
export class KeywordController {
  constructor(private readonly keywordService: KeywordService) {}

  @Post()
  create(@Body() data: Keyword): Promise<Keyword> {
    return this.keywordService.create(data);
  }

  @Get()
  findAll(): Promise<Keyword[]> {
    return this.keywordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Keyword | null> {
    return this.keywordService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Keyword): Promise<Keyword> {
    return this.keywordService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Keyword> {
    return this.keywordService.remove(id);
  }
}

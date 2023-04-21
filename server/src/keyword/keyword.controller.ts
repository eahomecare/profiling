import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { Keyword } from '@prisma/client';

interface CreateKeywordDto {
  category: string;
  value: string;
  customerIDs?: string[];
}

@Controller('keyword')
export class KeywordController {
  constructor(private readonly keywordService: KeywordService) {}

  @Post()
  async create(@Body() data: Keyword): Promise<{ success: boolean, data?: Keyword, error?: string }> {
    try {
      const keyword = await this.keywordService.create(data);
      return { success: true, data: keyword, error: undefined };
    } catch (error) {
      return { success: false, data: undefined, error: error.message };
    }
  }

  @Get()
  async findAll(): Promise<{ success: boolean, data?: Keyword[], error?: string }> {
    try {
      const keywords = await this.keywordService.findAll();
      return { success: true, data: keywords };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{ success: boolean, data?: Keyword | null, error?: string }> {
    try {
      const keyword = await this.keywordService.findOne(id);
      return { success: true, data: keyword };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: Keyword): Promise<{ success: boolean, data?: Keyword, error?: string }> {
    try {
      const keyword = await this.keywordService.update(id, data);
      return { success: true, data: keyword };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean, data?: Keyword, error?: string }> {
    try {
      const keyword = await this.keywordService.remove(id);
      return { success: true, data: keyword };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}


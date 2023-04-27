import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { Keyword } from '@prisma/client';

interface CreateKeywordDto {
  category: string;
  value: string;
  customerIDs?: string[];
}

interface KeywordWithOptionalError
  extends Keyword {
  error?: any;
}

@Controller('keywords')
export class KeywordController {
  constructor(
    private readonly keywordService: KeywordService,
  ) {}

  @Post()
  async create(
    @Body() data: Keyword,
  ): Promise<{
    success: boolean;
    data?: Keyword;
    error?: string;
  }> {
    try {
      const keyword =
        await this.keywordService.create(data);
      return {
        success: true,
        data: keyword,
        error: undefined,
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        error: error.message,
      };
    }
  }

  @Post('/many')
  async createMany(
    @Body() data: Keyword[],
  ): Promise<KeywordWithOptionalError[]> {
    const results: KeywordWithOptionalError[] =
      [];

    for (const payload of data) {
      try {
        const existingKeyword =
          await this.keywordService.findByCategoryAndValue(
            payload.category,
            payload.value,
          );

        if (existingKeyword) {
          results.push(existingKeyword);
        } else {
          const createdKeyword =
            await this.keywordService.create(
              payload,
            );
          results.push(createdKeyword);
        }
      } catch (error) {
        results.push({
          ...payload,
          error: error.message,
        });
      }
    }

    return results;
  }

  @Get()
  async findAll(): Promise<{
    success: boolean;
    data?: Keyword[];
    error?: string;
  }> {
    try {
      const keywords =
        await this.keywordService.findAll();
      return { success: true, data: keywords };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{
    success: boolean;
    data?: Keyword | null;
    error?: string;
  }> {
    try {
      const keyword =
        await this.keywordService.findOne(id);
      return { success: true, data: keyword };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('/search/:query')
  async search(
    @Param('query') query: string,
  ): Promise<any> {
    try {
      const results =
        await this.keywordService.search(query);
      return results;
    } catch (error) {
      // handle the error
      console.log(error);
      throw new Error(
        `Could not search for keywords: ${error.message}`,
      );
    }
  }
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Keyword,
  ): Promise<{
    success: boolean;
    data?: Keyword;
    error?: string;
  }> {
    try {
      const keyword =
        await this.keywordService.update(
          id,
          data,
        );
      return { success: true, data: keyword };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{
    success: boolean;
    data?: Keyword;
    error?: string;
  }> {
    try {
      const keyword =
        await this.keywordService.remove(id);
      return { success: true, data: keyword };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('/customer/:id')
  async getCustomerKeywords(
    @Param('id') id: string,
  ): Promise<{
    success: boolean;
    data?: Keyword[];
    error?: string;
  }> {
    try {
      const keywords =
        await this.keywordService.findByCustomerId(
          id,
        );
      return { success: true, data: keywords };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

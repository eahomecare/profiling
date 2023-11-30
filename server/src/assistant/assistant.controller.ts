import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Logger,
} from '@nestjs/common';
import { QueryService } from './assistant.service';
import { QueryDto } from './dto/query.dto';

@Controller('assistant')
export class QueryController {
  private readonly logger = new Logger(
    QueryController.name,
  );

  constructor(
    private readonly queryService: QueryService,
  ) {}

  // @Get()
  // async getQueryResponse(@Query('query') query: string): Promise<any> {
  //   this.logger.log(`Received query: ${query}`);
  //   try {
  //     const response = await this.queryService.handleQuery(query);
  //     return response;
  //   } catch (error) {
  //     this.logger.error('Error processing query:', error);
  //     throw error; // Or handle it more gracefully
  //   }
  // }

  @Post()
  async postQueryResponse(
    @Body() queryDto: QueryDto,
  ): Promise<any> {
    const { query, threadId } = queryDto;
    this.logger.log(
      `Received query: ${query} with threadId: ${threadId}`,
    );
    try {
      const response =
        await this.queryService.handleQuery(
          query,
          threadId,
        );
      return response;
    } catch (error) {
      this.logger.error(
        'Error processing query:',
        error,
      );
      throw error;
    }
  }

  // @Get(':threadId')
  // async getQueryWithThread(@Param('threadId') threadId: string, @Query('query') query: string): Promise<any> {
  //   this.logger.log(`Received query with thread ID ${threadId}: ${query}`);
  //   try {
  //     const response = await this.queryService.handleQuery(query, threadId);
  //     return response;
  //   } catch (error) {
  //     this.logger.error(`Error processing query with thread ID ${threadId}:`, error);
  //     throw error; // Or handle it more gracefully
  //   }
  // }
}

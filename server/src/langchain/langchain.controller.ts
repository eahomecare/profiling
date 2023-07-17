import { Controller, Post, Body, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { LangchainService } from './langchain.service';

@Controller('process')
export class LangchainController {
    constructor(private readonly langchainService: LangchainService) { }

    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    async process(@Body('input') input: string) {
        const result = await this.langchainService.process(input);
        return { result };
    }
}
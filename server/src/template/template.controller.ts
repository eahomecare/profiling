import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TemplateService } from './template.service';
import { Template, Prisma } from '@prisma/client';

@Controller('templates')
export class TemplateController {
    constructor(private readonly templateService: TemplateService) { }

    @Get()
    async getAllTemplates(): Promise<Template[]> {
        return this.templateService.findAll();
    }

    @Get(':id')
    async getTemplateById(@Param('id') id: string): Promise<Template> {
        return this.templateService.findOne(id);
    }

    @Post()
    async createTemplate(@Body() data: Prisma.TemplateCreateInput): Promise<Template> {
        return this.templateService.create(data);
    }
}

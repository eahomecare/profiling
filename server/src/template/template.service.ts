import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Template, Prisma } from '@prisma/client';

@Injectable()
export class TemplateService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<Template[]> {
        return this.prisma.template.findMany();
    }

    async findOne(id: string): Promise<Template | null> {
        return this.prisma.template.findUnique({
            where: { id },
        });
    }

    async create(data: Prisma.TemplateCreateInput): Promise<Template> {
        try {
            const createdTemplate = await this.prisma.template.create({
                data,
            });
            return createdTemplate;
        } catch (error) {
            throw new Error('Failed to create template');
        }
    }
}

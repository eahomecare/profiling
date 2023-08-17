import {
    Injectable,
    UnauthorizedException,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LangchainService } from '../../langchain/langchain.service';
import { examples } from '../../langchain/plainStringExamples';
import { Customer } from '@prisma/client';

const _ = require('lodash');

@Injectable()
export class AgentQuestionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly langchainService: LangchainService
    ) { }

    async getQuestionsForCustomer(customer: Customer) {
        if (!customer) {
            throw new UnauthorizedException('No customer provided');
        }

        const categories = await this.computeCategories(customer.id);
        if (!categories || !Object.keys(categories).length) {
            throw new NotFoundException('No categories found for the customer.');
        }

        const selectedCategories = this.selectThreeCategories(categories);
        if (!selectedCategories || !selectedCategories.length) {
            throw new NotFoundException('No suitable categories selected.');
        }

        if (this.configService.get<string>('AI-Questions') === 'true') {
            return this.aiQuestions(selectedCategories, categories);
        } else {
            return this.fallback(selectedCategories, categories);
        }
    }

    private async computeCategories(customerId: string) {
        const mappings = await this.prisma.profileTypeCustomerMapping.findMany({
            where: { customerId },
            include: {
                profileType: true,
                customer: {
                    include: {
                        keywords: true,
                    },
                },
            },
        });

        const categories = {};
        for (const mapping of mappings) {
            const { profileType, customer } = mapping;
            const keywords = customer.keywords;
            const categoryName = profileType.name.toLowerCase();

            if (!categories[categoryName]) {
                categories[categoryName] = [];
                categories[categoryName].push({
                    key: categoryName,
                    level: 1,
                });
            }

            const filtered_keywords = _.filter(
                keywords,
                { category: categoryName },
            );

            for (const keyword of filtered_keywords) {
                categories[categoryName].push({
                    key: keyword.value.toLowerCase(),
                    level: keyword.level,
                });
            }
        }

        return categories;
    }

    private selectThreeCategories(categories) {
        const filteredCategories = Object.keys(categories).filter(category => {
            return !categories[category].some(item => item.level === 5);
        });

        const sortedCategories = filteredCategories.sort((a, b) => {
            const maxLevelA = Math.max(...categories[a].map(item => item.level));
            const maxLevelB = Math.max(...categories[b].map(item => item.level));
            return maxLevelB - maxLevelA;
        });

        let resultCategories = [];
        if (sortedCategories.length >= 1) {
            resultCategories.push(sortedCategories[0]);
        }
        if (sortedCategories.length >= 2) {
            resultCategories.push(sortedCategories[1]);
        }

        const remainingCategories = filteredCategories.filter(cat => !resultCategories.includes(cat));
        if (remainingCategories.length) {
            const randomCategory = remainingCategories[Math.floor(Math.random() * remainingCategories.length)];
            resultCategories.push(randomCategory);
        }

        return resultCategories;
    }

    private async aiQuestions(selectedCategories, categories) {
        let responses = [];
        for (const category of selectedCategories) {
            const inputString = categories[category].map(c => `key: ${c.key}, level: ${c.level}`).join(', ');
            try {
                let response = await this.langchainService.process(inputString);
                response = `Category: ${category}, ${response}, None`;
                responses.push(response);
            } catch (error) {
                throw new InternalServerErrorException(`Failed to process category: ${category}. Error: ${error.message}`);
            }
        }
        return {
            questions: responses,
            method: 'AI'
        };
    }

    private fallback(selectedCategories, categories) {
        let responses = [];
        console.log('Selected Categories', selectedCategories, categories)
        for (const category of selectedCategories) {
            const inputString = categories[category].map(c => `key: ${c.key}, level: ${c.level}`).join(', ');
            const response = this.findQuestionFromExamples(inputString);
            if (response) {
                responses.push(`Category: ${category}, ${response}, None`);
            } else {
                throw new NotFoundException(`No fallback question found for category: ${category}.`);
            }
        }
        return {
            questions: responses,
            method: 'fallback'
        };
    }

    private findQuestionFromExamples(inputString) {
        console.log(inputString)
        for (const example of examples) {
            if (example.Input === inputString) {
                return example.Response;
            }
        }
        throw new NotFoundException(`Example not found for input: ${inputString} in fallback method.`);
    }
}
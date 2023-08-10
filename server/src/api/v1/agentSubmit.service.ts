import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserAgentSessionMapping } from '@prisma/client';

@Injectable()
export class SubmitService {
    constructor(private prisma: PrismaService) { }

    async connectCustomerToKeywords(customerId: string, keywordIds: string[]): Promise<any[]> {
        let connectedKeywords = [];
        for (const keywordId of keywordIds) {
            const updatedKeyword = await this.prisma.keyword.update({
                where: { id: keywordId },
                data: { customers: { connect: { id: customerId } } }
            });
            connectedKeywords.push(updatedKeyword);
        }
        return connectedKeywords;
    }

    async handleRemarks(customerId: string, remark: string): Promise<void> {
        // Assuming remarks are stored elsewhere as well, you can fill this function as needed
    }

    async handleCreatedKeywords(customerId: string, agentId: string, keywords: string[]): Promise<string[]> {
        let createdKeywordIds = [];

        for (const keyword of keywords) {
            const createdKeyword = await this.prisma.createdKeywords.create({
                data: {
                    keyword: keyword,
                    customerID: customerId,
                    agentID: agentId,
                    submitID: null
                }
            });
            createdKeywordIds.push(createdKeyword.id);
        }

        return createdKeywordIds;
    }

    async handleQuestionResponses(questionResponses: any[], customerId: string): Promise<any> {
        let createdQuestions = [];
        let createdKeywordIds = [];
        for (const item of questionResponses) {
            const {
                question,
                category,
                level,
                type,
                options,
                selectedOptions
            } = item;

            const createdQuestion = await this.prisma.question.create({
                data: {
                    question,
                    category,
                    level,
                    type,
                    options,
                    customers: { connect: { id: customerId } },
                },
            });
            createdQuestions.push(createdQuestion.id);

            for (const option of options) {
                if (selectedOptions.includes(option)) {
                    const createdKeyword = await this.prisma.keyword.create({
                        data: {
                            category,
                            value: option,
                            level,
                            customers: { connect: { id: customerId } },
                            questionIDs: [createdQuestion.id],
                        },
                    });
                    createdKeywordIds.push(createdKeyword.id);

                    await this.prisma.customer.update({
                        where: { id: customerId },
                        data: {
                            keywordIDs: { push: createdKeyword.id },
                        },
                    });
                }
            }
        }
        return {
            questions: createdQuestions,
            keywords: createdKeywordIds
        };
    }

    async findCustomerByMobile(mobile: string): Promise<any> {
        return this.prisma.customer.findUnique({
            where: { mobile: mobile }
        });
    }

    async findUserByAgentSession(sessionID: string): Promise<UserAgentSessionMapping> {
        const userAgentMapping = await this.prisma.userAgentSessionMapping.findFirst({
            where: { sessionId: sessionID }
        });
        return userAgentMapping;
    }

    async getAgentIDFromSession(agentSession: UserAgentSessionMapping): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { id: agentSession.userId }
        })
        return user.agentID
    }

    async createAgentSubmit(data: any, createdKeywordIds: string[]): Promise<void> {
        const createdAgentSubmit = await this.prisma.agentSubmits.create({
            data: data
        });

        // Update the createdKeywords with the submitID
        for (const keywordId of createdKeywordIds) {
            await this.prisma.createdKeywords.update({
                where: { id: keywordId },
                data: { submitID: createdAgentSubmit.id }
            });
        }
    }
}
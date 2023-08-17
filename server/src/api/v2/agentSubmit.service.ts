import { Injectable, NotFoundException, PreconditionFailedException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserAgentSessionMapping } from '@prisma/client';

@Injectable()
export class SubmitService {
    constructor(private prisma: PrismaService) { }

    async connectCustomerToKeywords(customerId: string, keywordIds: string[]): Promise<any[]> {
        let connectedKeywords = [];
        try {
            for (const keywordId of keywordIds) {
                const updatedKeyword = await this.prisma.keyword.update({
                    where: { id: keywordId },
                    data: { customers: { connect: { id: customerId } } }
                });
                connectedKeywords.push(updatedKeyword);
            }
            return connectedKeywords;
        } catch (error) {
            console.error("Error in connectCustomerToKeywords:", error);
            throw new PreconditionFailedException('Keywords and Customers seem to not exist. Check and try again')
        }
    }

    async handleCreatedKeywords(customerId: string, agentId: string, keywords: string[]): Promise<string[]> {
        let createdKeywordIds = [];
        try {
            for (const keyword of keywords) {
                const createdKeyword = await this.prisma.keyword.create({
                    data: {
                        value: keyword,
                        category: 'unknown',
                        customers: { connect: { id: customerId } }
                    }
                });
                createdKeywordIds.push(createdKeyword.id);
            }
            return createdKeywordIds;
        } catch (error) {
            console.error("Error in handleCreatedKeywords:", error);
            throw new UnprocessableEntityException('Keywords is not structured properly, check and try again.')
        }
    }

    async handleQuestionResponses(questionResponses: any[], customerId: string): Promise<any> {
        let createdQuestions = [];
        let createdKeywordIds = [];
        try {
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
        } catch (error) {
            console.error("Error in handleQuestionResponses:", error);
            throw new UnprocessableEntityException('questionResponses is not structured properly, check and try again.')
        }
    }

    async findCustomerByMobile(mobile: string): Promise<any> {
        try {
            return this.prisma.customer.findUnique({
                where: { mobile: mobile }
            });
        } catch (error) {
            console.error("Error in findCustomerByMobile:", error);
            throw new NotFoundException('Mobile provided not found')
        }
    }

    async findUserByAgentSession(sessionID: string): Promise<UserAgentSessionMapping> {
        try {
            const userAgentMapping = await this.prisma.userAgentSessionMapping.findFirst({
                where: { sessionId: sessionID }
            });
            return userAgentMapping;
        } catch (error) {
            console.error("Error in findUserByAgentSession:", error);
            throw new NotFoundException('Agent session not found')
        }
    }

    async getAgentIDFromSession(agentSession: UserAgentSessionMapping): Promise<any> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: agentSession.userId }
            })
            return user.agentID
        } catch (error) {
            console.error("Error in getAgentIDFromSession:", error);
            throw new NotFoundException('Agent ID missing')
        }
    }

    async createAgentSubmit(data: any): Promise<void> {
        try {
            const { keywords, questions, ...otherData } = data;

            const newAgentSubmit = await this.prisma.agentSubmits.create({
                data: {
                    ...otherData
                }
            });

            await this.prisma.agentSubmitKeywordsMapping.createMany({
                data: keywords.map(keywordId => ({
                    agentSubmitId: newAgentSubmit.id,
                    keywordId: keywordId
                }))
            });

            await this.prisma.agentSubmitQuestionsMapping.createMany({
                data: questions.map(questionId => ({
                    agentSubmitId: newAgentSubmit.id,
                    questionId: questionId
                }))
            });

        } catch (error) {
            console.error("Error in createAgentSubmit:", error);
            throw new UnprocessableEntityException('Something went wrong in processing the data. Please check the request and try again');
        }
    }
}
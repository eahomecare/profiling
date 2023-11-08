import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AgentSession,
  User,
} from '@prisma/client';
import Filter = require('bad-words');
import { ProfileTypeCustomerMappingService } from 'src/profile-type-customer-mapping/profile-type-customer-mapping.service';

@Injectable()
export class SubmitService {
  private filter: Filter;
  constructor(
    private prisma: PrismaService,
    private profileTypeCustomerMapping: ProfileTypeCustomerMappingService,
  ) {
    this.filter = new Filter();
  }

  async connectCustomerToKeywords(
    customerId: string,
    keywordIds: string[],
  ): Promise<any[]> {
    const connectedKeywords = [];
    try {
      for (const keywordId of keywordIds) {
        const updatedKeyword =
          await this.prisma.keyword.update({
            where: { id: keywordId },
            data: {
              customers: {
                connect: { id: customerId },
              },
            },
          });
        connectedKeywords.push(updatedKeyword);
      }
      return connectedKeywords;
    } catch (error) {
      console.error(
        'Error in connectCustomerToKeywords:',
        error,
      );
      throw new PreconditionFailedException(
        'Keywords and Customers seem to not exist. Check and try again',
      );
    }
  }

  async handleCreatedKeywords(
    customerId: string,
    agentId: string,
    keywords: string[],
  ): Promise<string[]> {
    const createdKeywordIds = [];
    const cleanedKeywords = keywords.filter(
      (keyword) =>
        !this.filter.isProfane(keyword),
    );

    try {
      for (const keyword of cleanedKeywords) {
        const createdKeyword =
          await this.prisma.keyword.create({
            data: {
              value: keyword,
              category: 'unknown',
              customers: {
                connect: { id: customerId },
              },
            },
          });
        createdKeywordIds.push(createdKeyword.id);
      }
      return createdKeywordIds;
    } catch (error) {
      console.error(
        'Error in handleCreatedKeywords:',
        error,
      );
      throw new UnprocessableEntityException(
        'Keywords is not structured properly, check and try again.',
      );
    }
  }

  async handleQuestionResponses(
    questionResponses: any[],
    customerId: string,
  ): Promise<any> {
    const createdQuestions = [];
    const createdKeywordIds = [];
    try {
      for (const item of questionResponses) {
        const {
          question,
          category,
          level,
          type,
          options,
          selectedOptions,
        } = item;

        const createdQuestion =
          await this.prisma.question.create({
            data: {
              question,
              category,
              level,
              type,
              options,
              customers: {
                connect: { id: customerId },
              },
            },
          });
        createdQuestions.push(createdQuestion.id);

        for (const option of options) {
          if (selectedOptions.includes(option)) {
            const existingKeyword =
              await this.prisma.keyword.findUnique(
                {
                  where: {
                    value_category: {
                      value: option,
                      category,
                    },
                  },
                },
              );

            if (existingKeyword) {
              createdKeywordIds.push(
                existingKeyword.id,
              );
              await this.prisma.question.update({
                where: { id: createdQuestion.id },
                data: {
                  keywords: {
                    connect: {
                      id: existingKeyword.id,
                    },
                  },
                },
              });

              if (
                !existingKeyword.customerIDs.includes(
                  customerId,
                )
              ) {
                await this.prisma.keyword.update({
                  where: {
                    id: existingKeyword.id,
                  },
                  data: {
                    customers: {
                      connect: { id: customerId },
                    },
                  },
                });
              }
              console.log(
                'Keyword connected:\n',
                existingKeyword,
                'To question Id:\n',
                createdQuestion.id,
                'and customer:',
                customerId,
              );
            } else {
              const createdKeyword =
                await this.prisma.keyword.create({
                  data: {
                    category,
                    value: option,
                    level,
                    customers: {
                      connect: { id: customerId },
                    },
                    questions: {
                      connect: {
                        id: createdQuestion.id,
                      },
                    },
                  },
                });
              createdKeywordIds.push(
                createdKeyword.id,
              );
              console.log(
                'Keyword created',
                createdKeyword,
                'To question Id:\n',
                createdQuestion.id,
                'and customer:',
                customerId,
              );
            }
          }
        }
      }
      return {
        questions: createdQuestions,
        keywords: createdKeywordIds,
      };
    } catch (error) {
      console.error(
        'Error in handleQuestionResponses:',
        error,
      );
      throw new UnprocessableEntityException(
        'questionResponses is not structured properly, check and try again.',
      );
    }
  }

  async findCustomerByMobile(
    mobile: string,
  ): Promise<any> {
    try {
      return this.prisma.customer.findUnique({
        where: { mobile: mobile },
      });
    } catch (error) {
      console.error(
        'Error in findCustomerByMobile:',
        error,
      );
      throw new NotFoundException(
        'Mobile provided not found',
      );
    }
  }

  async getAgentIDFromSession(
    agentSessionID: string,
  ): Promise<string | null> {
    try {
      const agentSessionInstance =
        await this.prisma.agentSession.findUnique(
          {
            where: { id: agentSessionID },
            include: { user: true },
          },
        );

      console.log(
        'user',
        agentSessionInstance.user,
      );
      return (
        agentSessionInstance?.user?.agentID ||
        null
      );
    } catch (error) {
      console.error(
        'Error in getAgentIDFromSession:',
        error,
      );
      throw new NotFoundException(
        'Agent ID missing',
      );
    }
  }

  async createAgentSubmit(
    data: any,
  ): Promise<void> {
    try {
      const {
        keywords,
        questions,
        ...otherData
      } = data;

      const newAgentSubmit =
        await this.prisma.agentSubmits.create({
          data: {
            ...otherData,
          },
        });

      if (keywords.length)
        await this.prisma.agentSubmitKeywordsMapping.createMany(
          {
            data: keywords.map((keywordId) => ({
              agentSubmitId: newAgentSubmit.id,
              keywordId: keywordId,
            })),
          },
        );

      if (questions.length)
        await this.prisma.agentSubmitQuestionsMapping.createMany(
          {
            data: questions.map((questionId) => ({
              agentSubmitId: newAgentSubmit.id,
              questionId: questionId,
            })),
          },
        );
      await this.profileTypeCustomerMapping.updateProfileTypeCustomerMappingGeneric(
        data.customerID,
      );
    } catch (error) {
      console.error(
        'Error in createAgentSubmit:',
        error,
      );
      throw new UnprocessableEntityException(
        'Something went wrong in processing the data. Please check the request and try again',
      );
    }
  }
}

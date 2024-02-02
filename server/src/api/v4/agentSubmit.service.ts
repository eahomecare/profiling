import {
  Injectable,
  Logger,
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
  private readonly logger = new Logger(
    SubmitService.name,
  );
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
    this.logger.log(
      `Connecting customer with ID ${customerId} to keyword IDs: ${keywordIds.join(
        ', ',
      )}`,
    );
    const connectedKeywords = [];

    try {
      for (const keywordId of keywordIds) {
        this.logger.log(
          `Processing keyword ID: ${keywordId}`,
        );

        // Updating the keyword
        this.logger.log(
          `Updating keyword with ID: ${keywordId} for customer ID: ${customerId}`,
        );
        const updatedKeyword =
          await this.prisma.keyword.update({
            where: { id: keywordId },
            data: {
              customers: {
                connect: { id: customerId },
              },
            },
            include: {
              profile_types: true,
            },
          });
        this.logger.log(
          `Updated keyword: ${JSON.stringify(
            updatedKeyword,
          )}`,
        );

        // Find ProfileType based on keyword category
        const profileType =
          await this.prisma.profileType.findFirst(
            {
              where: {
                category: updatedKeyword.category,
              },
            },
          );

        if (profileType) {
          this.logger.debug(
            `Updating ProfileTypeCustomerMapping for profile type ID: ${profileType.id} and customer ID: ${customerId}`,
          );
          await this.prisma.profileTypeCustomerMapping.updateMany(
            {
              where: {
                customerId: customerId,
                profileTypeId: profileType.id,
                isEnabled: false,
              },
              data: {
                isEnabled: true,
              },
            },
          );
          this.logger.debug(
            `Updated ProfileTypeCustomerMapping for profile type ID: ${profileType.id}`,
          );
        } else {
          this.logger.warn(
            `No ProfileType found for category: ${updatedKeyword.category}`,
          );
          // Optionally handle the case where no matching ProfileType is found
        }

        connectedKeywords.push(updatedKeyword);
      }

      return connectedKeywords;
    } catch (error) {
      this.logger.error(
        `Error in connectCustomerToKeywords for customer ID ${customerId}: ${error.message}`,
      );
      throw new PreconditionFailedException(
        'Error connecting customer to keywords. Please check the provided data and try again.',
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
          isNotRelevant,
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

        if (isNotRelevant) {
          await this.prisma.profileTypeCustomerMapping.updateMany(
            {
              where: {
                customerId: customerId,
                profileType: {
                  category: category,
                },
              },
              data: {
                isEnabled: false,
              },
            },
          );
        }

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

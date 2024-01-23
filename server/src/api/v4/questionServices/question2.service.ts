import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CustomerSessionService } from './customerSession.service';
import { AiEngineService } from './engines/v1/aiEngine.service';
import { ServiceObject } from './interfaces/serviceObject.interface';
import { shuffle } from 'lodash';

@Injectable()
export class Question2Service {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiEngineService: AiEngineService,
    private readonly customerSessionService: CustomerSessionService,
  ) {}

  async handleQuestion(
    customer: Customer,
    sessionObject: Record<number, string>,
    serviceObject: ServiceObject,
  ) {
    const keywords =
      await this.prisma.keyword.findMany({
        where: {
          customerIDs: { hasSome: [customer.id] },
        },
        select: {
          value: true,
          level: true,
          category: true,
        },
      });

    console.log(keywords);

    const enabledProfileTypes =
      await this.prisma.profileTypeCustomerMapping.findMany(
        {
          where: {
            customerId: customer.id,
            isEnabled: true,
          },
          select: {
            profileType: {
              select: {
                category: true,
              },
            },
          },
        },
      );
    const enabledCategories =
      enabledProfileTypes.map((pt) =>
        pt.profileType.category.toLowerCase(),
      );

    const filteredKeywords = keywords.filter(
      (kw) =>
        enabledCategories.includes(
          kw.category.toLowerCase(),
        ) &&
        kw.category.toLowerCase() !== 'unknown',
    );

    let selectedCategory = '';
    if (filteredKeywords.length === 0) {
      const randomizedCategories = shuffle(
        enabledCategories,
      );
      const nonRepeatedCategories =
        randomizedCategories.filter(
          (cat) =>
            !Object.values(
              sessionObject,
            ).includes(cat),
        );
      if (nonRepeatedCategories.length > 0) {
        selectedCategory =
          nonRepeatedCategories[
            Math.floor(
              Math.random() *
                nonRepeatedCategories.length,
            )
          ];
      }
    } else {
      const categoryLevels =
        filteredKeywords.reduce(
          (acc, keyword) => {
            if (!acc[keyword.category]) {
              acc[keyword.category] = {
                totalLevel: 0,
                count: 0,
              };
            }
            acc[keyword.category].totalLevel +=
              keyword.level;
            acc[keyword.category].count++;
            return acc;
          },
          {},
        );

      const sortedCategories = Object.keys(
        categoryLevels,
      )
        .map((category) => ({
          category,
          averageLevel:
            categoryLevels[category].totalLevel /
            categoryLevels[category].count,
        }))
        .sort(
          (a, b) =>
            b.averageLevel - a.averageLevel,
        );

      for (const category of sortedCategories) {
        const isCategoryUsedInOtherQuestions =
          Object.entries(sessionObject).some(
            ([questionNumber, usedCategory]) => {
              return (
                parseInt(questionNumber) !== 2 &&
                usedCategory === category.category
              );
            },
          );

        if (!isCategoryUsedInOtherQuestions) {
          selectedCategory = category.category;
          break;
        }
      }

      if (!selectedCategory) {
        const randomizedCategories = shuffle(
          enabledCategories,
        );
        const nonRepeatedCategories =
          randomizedCategories.filter(
            (cat) =>
              !Object.values(
                sessionObject,
              ).includes(cat),
          );
        selectedCategory =
          nonRepeatedCategories[
            Math.floor(
              Math.random() *
                nonRepeatedCategories.length,
            )
          ];
      }
    }

    await this.customerSessionService.updateSessionQuestion(
      customer.id,
      2,
      selectedCategory,
    );

    const customerKeywords =
      await this.prisma.keyword.findMany({
        where: {
          customerIDs: { hasSome: [customer.id] },
          category: selectedCategory,
        },
        select: {
          level: true,
        },
      });

    const totalLevel = customerKeywords.reduce(
      (acc, keyword) =>
        acc + (keyword.level || 0),
      0,
    );
    const maxLevelInCurrentLoop =
      (totalLevel % 5) + 1;

    let levelRequired = maxLevelInCurrentLoop;
    if (levelRequired == 1) levelRequired = 2;

    const pastKeywordsAndQuestions =
      await this.getCustomerPastInteractions(
        customer.id,
        selectedCategory,
      );

    const aiEngineResponse =
      await this.aiEngineService.processServiceInformation(
        levelRequired,
        selectedCategory,
        levelRequired > 3
          ? serviceObject.serviceTitle
          : '',
        levelRequired > 3
          ? serviceObject.serviceDescription
          : '',
        pastKeywordsAndQuestions.formattedPastKeywords ||
          [],
        pastKeywordsAndQuestions.formattedPastQuestionsAnswers ||
          [],
      );

    return aiEngineResponse;
  }

  private async getCustomerPastInteractions(
    customerId: string,
    category: string,
  ) {
    const pastKeywords =
      await this.prisma.keyword.findMany({
        where: {
          category: category,
          customerIDs: { hasSome: [customerId] },
        },
        select: { value: true, level: true },
      });

    const pastQuestions =
      await this.prisma.question.findMany({
        where: {
          category: category,
          customerIDs: {
            hasSome: [customerId],
          },
        },
        select: {
          id: true,
          category: true,
          question: true,
          level: true,
          options: true,
        },
      });

    const pastQuestionsAnswers =
      await Promise.all(
        pastQuestions.map(async (q) => {
          const relatedKeywords =
            await this.prisma.keyword.findMany({
              where: {
                questionIDs: {
                  hasSome: [q.id],
                },
                customerIDs: {
                  hasSome: [customerId],
                },
              },
              select: {
                value: true,
              },
            });

          return {
            level: q.level,
            category: q.category,
            question: q.question,
            possibleOptions: q.options,
            answersSelected: relatedKeywords.map(
              (kw) => kw.value,
            ),
          };
        }),
      );

    const formattedPastKeywords =
      pastKeywords.map((kw) => ({
        key: kw.value,
        level: kw.level.toString(),
      }));
    const formattedPastQuestionsAnswers =
      pastQuestionsAnswers.map((q) => ({
        level: q.level,
        category: q.category,
        question: q.question,
        possibleOptions: q.possibleOptions,
        answersSelected: q.answersSelected,
      }));

    return {
      formattedPastKeywords,
      formattedPastQuestionsAnswers,
    };
  }
}

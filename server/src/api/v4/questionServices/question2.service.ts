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
    console.log(
      `Starting to handle question for customer ${customer.id}`,
    );

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

    console.log(
      `Retrieved keywords for customer ${customer.id}:`,
      keywords,
    );

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
    console.log(
      `Enabled profile types for customer ${customer.id}:`,
      enabledProfileTypes,
    );

    const enabledCategories =
      enabledProfileTypes.map((pt) =>
        pt.profileType.category.toLowerCase(),
      );
    console.log(
      `Enabled categories for customer ${customer.id}:`,
      enabledCategories,
    );

    const filteredKeywords = keywords.filter(
      (kw) =>
        enabledCategories.includes(
          kw.category.toLowerCase(),
        ) &&
        kw.category.toLowerCase() !== 'unknown',
    );
    console.log(
      `Filtered keywords for enabled categories:`,
      filteredKeywords,
    );

    let selectedCategory = '';
    if (filteredKeywords.length === 0) {
      console.log(
        `No filtered keywords found, selecting category randomly.`,
      );
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
      console.log(
        `Randomly selected category: ${selectedCategory}`,
      );
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

      console.log(
        `Sorted categories by average level:`,
        sortedCategories,
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
        console.log(
          `No unused category found in sorted list, selecting randomly among enabled categories.`,
        );
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
      console.log(
        `Selected category after filtering and checking session object: ${selectedCategory}`,
      );
    }

    await this.customerSessionService.updateSessionQuestion(
      customer.id,
      2,
      selectedCategory,
    );
    console.log(
      `Updated session question for customer ${customer.id} with category ${selectedCategory}`,
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
    console.log(
      `Total level: ${totalLevel}, Max level in current loop: ${maxLevelInCurrentLoop}`,
    );

    let levelRequired = maxLevelInCurrentLoop;
    if (levelRequired == 1) levelRequired = 2;
    console.log(
      `Level required after adjustment: ${levelRequired}`,
    );

    const pastKeywordsAndQuestions =
      await this.getCustomerPastInteractions(
        customer.id,
        selectedCategory,
      );
    console.log(
      `Retrieved past interactions for category ${selectedCategory}:`,
      pastKeywordsAndQuestions,
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

    console.log(
      `AI Engine response:`,
      aiEngineResponse,
    );

    return aiEngineResponse;
  }

  private async getCustomerPastInteractions(
    customerId: string,
    category: string,
  ) {
    console.log(
      `Retrieving past interactions for customer ${customerId} and category ${category}`,
    );

    const pastKeywords =
      await this.prisma.keyword.findMany({
        where: {
          category: category,
          customerIDs: { hasSome: [customerId] },
        },
        select: { value: true, level: true },
      });
    console.log(`Past keywords:`, pastKeywords);

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
    console.log(`Past questions:`, pastQuestions);

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

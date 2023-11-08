import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CustomerSessionService } from './customerSession.service';
import { AiEngineService } from './engines/v1/aiEngine.service';

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

    const filteredKeywords = keywords.filter(
      (kw) =>
        kw.category.toLowerCase() !== 'unknown',
    );

    let selectedCategory = '';
    if (filteredKeywords.length === 0) {
      const allCategories =
        await this.prisma.profileType.findMany({
          select: { category: true },
        });
      const uniqueCategories = Array.from(
        new Set(
          allCategories
            .map((pt) =>
              pt.category.toLowerCase(),
            )
            .filter((cat) => cat !== 'unknown'),
        ),
      );
      const nonRepeatedCategories =
        uniqueCategories.filter(
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
        const allCategories =
          await this.prisma.profileType.findMany({
            select: { category: true },
          });
        const uniqueCategories = Array.from(
          new Set(
            allCategories
              .map((pt) =>
                pt.category.toLowerCase(),
              )
              .filter((cat) => cat !== 'unknown'),
          ),
        );
        const nonRepeatedCategories =
          uniqueCategories.filter(
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

    const profileTypeMapping =
      await this.prisma.profileTypeCustomerMapping.findFirst(
        {
          where: {
            customerId: customer.id,
            profileType: {
              category: selectedCategory,
            },
          },
        },
      );

    let maxLevelInCurrentLoop =
      profileTypeMapping?.maxLevelInCurrentLoop ??
      0;
    let resetCount =
      profileTypeMapping?.resetCount ?? 0;

    if (
      resetCount === 0 &&
      maxLevelInCurrentLoop === 0
    ) {
      const maxKeywordLevel = Math.max(
        0,
        ...(
          await this.prisma.keyword.findMany({
            where: {
              category: selectedCategory,
              customerIDs: {
                hasSome: [customer.id],
              },
            },
            select: {
              level: true,
            },
          })
        ).map((keyword) => keyword.level),
      );

      maxLevelInCurrentLoop = maxKeywordLevel;
    }

    if (maxLevelInCurrentLoop >= 5) {
      maxLevelInCurrentLoop = 2;
      resetCount++;
    } else {
      maxLevelInCurrentLoop++;
    }

    let levelRequired = maxLevelInCurrentLoop;
    if (levelRequired == 1) levelRequired = 2;

    if (profileTypeMapping) {
      await this.prisma.profileTypeCustomerMapping.update(
        {
          where: { id: profileTypeMapping.id },
          data: {
            maxLevelInCurrentLoop:
              maxLevelInCurrentLoop,
            resetCount: resetCount,
          },
        },
      );
    } else {
      throw new NotFoundException(
        'Profile Type Customer Mapping not found!',
      );
    }

    const pastKeywordsAndQuestions =
      await this.getCustomerPastInteractions(
        customer.id,
        selectedCategory,
      );

    const aiEngineResponse =
      await this.aiEngineService.processServiceInformation(
        levelRequired,
        selectedCategory,
        '',
        '',
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

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CustomerSessionService } from './customerSession.service';
import { AiEngineService } from './engines/v1/aiEngine.service';
import { CategoryResolverService } from './categoryResolver.service';

@Injectable()
export class Question4Service {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiEngineService: AiEngineService,
    private readonly customerSessionService: CustomerSessionService,
    private readonly categoryResolverService: CategoryResolverService,
  ) {}

  async handleQuestion(
    customer: Customer,
    currentKeywords: any[],
  ) {
    const combinedKeywords = currentKeywords
      .map((kw) => kw.value)
      .join(' ');
    const category =
      await this.categoryResolverService.resolveCategory(
        { combinedKeywords },
      );
    const {
      formattedPastKeywords,
      formattedPastQuestionsAnswers,
    } = await this.getCustomerPastInteractions(
      customer.id,
      category,
    );

    await this.customerSessionService.updateSessionQuestion(
      customer.id,
      4,
      category,
    );

    const profileTypeMapping =
      await this.prisma.profileTypeCustomerMapping.findFirst(
        {
          where: {
            customerId: customer.id,
            profileType: {
              category: category,
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
              category: category,
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
    const aiEngineResponse =
      await this.aiEngineService.processServiceInformation(
        levelRequired,
        category,
        '',
        '',
        [
          ...formattedPastKeywords,
          ...currentKeywords.map((kw) => ({
            ...kw,
            category: category,
          })),
        ] || [],
        formattedPastQuestionsAnswers || [],
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

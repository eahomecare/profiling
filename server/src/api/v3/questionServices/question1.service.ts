import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { CategoryResolverService } from './categoryResolver.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiEngineService } from './engines/v1/aiEngine.service';
import homeCareServices from './serviceMappings/homecareServices';
import { CustomerSessionService } from './customerSession.service';
import { ServiceObject } from './interfaces/serviceObject.interface';
import { ServiceResolverService } from './serviceResolver.service';

@Injectable()
export class Question1Service {
  constructor(
    private readonly categoryResolver: CategoryResolverService,
    private readonly prisma: PrismaService,
    private readonly aiEngineService: AiEngineService,
    private readonly customerSessionService: CustomerSessionService,
    private readonly serviceResolver: ServiceResolverService,
  ) {}

  async handleQuestion(
    customer: Customer,
    serviceObject: ServiceObject,
    currentKeywords: any[],
  ) {
    let usedServiceResolver = false;

    if (
      !serviceObject.serviceTitle &&
      !serviceObject.serviceDescription
    ) {
      const firstKeywordValue =
        currentKeywords.length > 0
          ? currentKeywords[0].value
          : null;
      if (firstKeywordValue) {
        usedServiceResolver = true;
        const newServiceObject =
          await this.serviceResolver.resolveService(
            [firstKeywordValue],
          );
        if (
          newServiceObject.serviceTitle ||
          newServiceObject.serviceDescription
        ) {
          serviceObject = newServiceObject;
        }
      }
    }

    const category =
      await this.categoryResolver.resolveCategory(
        serviceObject.serviceTitle,
        serviceObject.serviceDescription,
      );

    await this.customerSessionService.updateSessionQuestion(
      customer.id,
      1,
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

    const pastKeywords = await this.prisma.keyword
      .findMany({
        where: {
          category: category,
          customerIDs: {
            hasSome: [customer.id],
          },
        },
        select: {
          value: true,
          level: true,
        },
      })
      .then((keywords) =>
        keywords.map((kw) => ({
          key: kw.value,
          level: String(kw.level),
        })),
      );

    if (
      usedServiceResolver &&
      currentKeywords.length > 0
    ) {
      const firstCurrentKeyword = {
        key: currentKeywords[0].value,
        level: currentKeywords[0].level
          ? String(currentKeywords[0].level)
          : '1',
      };
      pastKeywords.push(firstCurrentKeyword);
    }

    const pastQuestions =
      await this.prisma.question.findMany({
        where: {
          category: category,
          customerIDs: {
            hasSome: [customer.id],
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

    console.log('4', pastQuestions);
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
                  hasSome: [customer.id],
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

    console.log('5', pastQuestionsAnswers);

    const formattedPastKeywords =
      pastKeywords.map((kw) => ({
        key: kw.key,
        level: kw.level,
      }));

    const formattedPastQuestionsAnswers =
      pastQuestionsAnswers.map((q) => ({
        level: q.level,
        category: q.category,
        question: q.question,
        possibleOptions: q.possibleOptions,
        answersSelected: q.answersSelected,
      }));

    console.log(
      'pru',
      levelRequired,
      category,
      formattedPastKeywords,
      formattedPastQuestionsAnswers,
    );

    console.log(
      'question1',
      serviceObject.serviceTitle,
      serviceObject.serviceDescription,
      formattedPastKeywords,
    );

    const aiEngineResponse =
      await this.aiEngineService.processServiceInformation(
        levelRequired,
        category,
        serviceObject.serviceTitle,
        serviceObject.serviceDescription,
        formattedPastKeywords,
        formattedPastQuestionsAnswers,
      );

    return aiEngineResponse;
  }
}

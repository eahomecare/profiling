import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { CategoryResolverService } from './categoryResolver.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiEngineService } from './engines/v1/aiEngine.service';
import { CustomerSessionService } from './customerSession.service';
import { ServiceObject } from './interfaces/serviceObject.interface';
import { ServiceResolverService } from './serviceResolver.service';

@Injectable()
export class Question1Service {
  private readonly logger = new Logger(
    Question1Service.name,
  );

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
    sessionObject: Record<number, string>,
  ) {
    this.logger.log(
      'Starting handleQuestion process',
    );
    let category: string;
    let usedServiceResolver = false;

    if (
      serviceObject.serviceTitle ||
      serviceObject.serviceDescription
    ) {
      this.logger.log(
        'Resolving category based on service title and description',
      );
      category =
        await this.categoryResolver.resolveCategory(
          serviceObject,
        );
      this.logger.log(
        `Resolved category: ${category}`,
      );
    } else {
      if (
        currentKeywords &&
        currentKeywords.length > 0
      ) {
        this.logger.log(
          'Resolving category based on current keywords',
        );
        category =
          await this.categoryResolver.resolveCategory(
            { value: currentKeywords[0].value },
          );
        this.logger.log(
          `Resolved category with current keyword: ${category}`,
        );
        serviceObject =
          await this.serviceResolver.resolveService(
            { category },
          );
        this.logger.log(
          `Service resolved with category: ${JSON.stringify(
            serviceObject,
          )}`,
        );
        usedServiceResolver = true;
      } else {
        this.logger.log(
          'Fetching enabled profile types for customer',
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

        const enabledCategories =
          enabledProfileTypes
            .map((ptcm) =>
              ptcm.profileType.category.toLowerCase(),
            )
            .filter((cat) => cat !== 'unknown');
        const uniqueEnabledCategories =
          Array.from(new Set(enabledCategories));
        const nonRepeatedCategories =
          uniqueEnabledCategories.filter(
            (cat) =>
              !Object.values(
                sessionObject,
              ).includes(cat),
          );

        if (nonRepeatedCategories.length === 0) {
          throw new NotFoundException(
            'No unused categories available.',
          );
        }

        category =
          nonRepeatedCategories[
            Math.floor(
              Math.random() *
                nonRepeatedCategories.length,
            )
          ];
        this.logger.log(
          `Randomly selected category: ${category}`,
        );

        serviceObject =
          await this.serviceResolver.resolveService(
            { category },
          );
        this.logger.log(
          `Service resolved with random category: ${JSON.stringify(
            serviceObject,
          )}`,
        );
      }
    }

    this.logger.log(
      'Updating customer session with category',
    );
    await this.customerSessionService.updateSessionQuestion(
      customer.id,
      1,
      category,
    );

    this.logger.log(
      'Fetching customer keywords for category',
    );
    const customerKeywords =
      await this.prisma.keyword.findMany({
        where: {
          customerIDs: { hasSome: [customer.id] },
          category: category,
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
    if (levelRequired === 1) levelRequired = 2;
    this.logger.log(
      `Level required for AI Engine: ${levelRequired}`,
    );

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

    this.logger.log(
      'Fetching past questions for category',
    );
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

    const pastQuestionsAnswers =
      await Promise.all(
        pastQuestions.map(async (q) => {
          const relatedKeywords =
            await this.prisma.keyword.findMany({
              where: {
                questionIDs: { hasSome: [q.id] },
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

    this.logger.log(
      'Processing service information with AI Engine',
    );
    const aiEngineResponse =
      await this.aiEngineService.processServiceInformation(
        levelRequired,
        category,
        serviceObject.serviceTitle,
        serviceObject.serviceDescription,
        pastKeywords,
        pastQuestionsAnswers,
      );

    this.logger.log(
      'Handle question process completed',
    );
    return aiEngineResponse;
  }
}

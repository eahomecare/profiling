import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LangchainService } from '../../langchain/langchain.service';
import { examples } from '../../langchain/plainStringExamples';
import { Customer } from '@prisma/client';

const _ = require('lodash');

@Injectable()
export class AgentQuestionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly langchainService: LangchainService,
  ) {}

  async getQuestionsForCustomer(
    customer: Customer,
  ) {
    if (!customer) {
      throw new UnauthorizedException(
        'No customer provided',
      );
    }

    const categories =
      await this.computeCategories(customer.id);
    if (
      !categories ||
      !Object.keys(categories).length
    ) {
      throw new NotFoundException(
        'No categories found for the customer.',
      );
    }

    const selectedCategories =
      this.selectThreeCategories(categories);
    if (
      !selectedCategories ||
      !selectedCategories.length
    ) {
      throw new NotFoundException(
        'No suitable categories selected.',
      );
    }

    if (
      this.configService.get<string>(
        'AI-Questions',
      ) === 'true'
    ) {
      return this.aiQuestions(
        selectedCategories,
        categories,
      );
    } else {
      return this.fallback(
        selectedCategories,
        categories,
      );
    }
  }

  private async computeCategories(
    customerId: string,
  ) {
    const mappings =
      await this.prisma.profileTypeCustomerMapping.findMany(
        {
          where: { customerId },
          include: {
            profileType: true,
            customer: {
              include: {
                keywords: true,
              },
            },
          },
        },
      );

    console.log('mappings\n', mappings);

    const categories = {};
    for (const mapping of mappings) {
      const { profileType, customer } = mapping;
      const keywords = customer.keywords;
      const categoryName =
        profileType.name.toLowerCase();

      if (!categories[categoryName]) {
        categories[categoryName] = [];
        categories[categoryName].push({
          key: categoryName,
          level: 1,
        });
      }

      const filtered_keywords = _.filter(
        keywords,
        { category: categoryName },
      );
      console.log(
        'filtered keywords',
        filtered_keywords,
      );

      for (const keyword of filtered_keywords) {
        categories[categoryName].push({
          key: keyword.value.toLowerCase(),
          level: keyword.level,
        });
        console.log(
          'Keyword pushed from filtered keywords',
          keyword,
        );
      }
    }

    console.log('categories\n', categories);
    return categories;
  }

  private selectThreeCategories(categories) {
    const filteredCategories = Object.keys(
      categories,
    ).filter((category) => {
      return !categories[category].some(
        (item) => item.level === 5,
      );
    });

    const sortedCategories =
      filteredCategories.sort((a, b) => {
        const maxLevelA = Math.max(
          ...categories[a].map(
            (item) => item.level,
          ),
        );
        const maxLevelB = Math.max(
          ...categories[b].map(
            (item) => item.level,
          ),
        );
        return maxLevelB - maxLevelA;
      });

    const resultCategories = [];
    if (sortedCategories.length >= 1) {
      resultCategories.push(sortedCategories[0]);
    }
    if (sortedCategories.length >= 2) {
      resultCategories.push(sortedCategories[1]);
    }

    const remainingCategories =
      filteredCategories.filter(
        (cat) => !resultCategories.includes(cat),
      );
    if (remainingCategories.length) {
      const randomCategory =
        remainingCategories[
          Math.floor(
            Math.random() *
              remainingCategories.length,
          )
        ];
      resultCategories.push(randomCategory);
    }

    // console.log(
    //   'resultCategories=>\n',
    //   resultCategories,
    // );
    return resultCategories;
  }

  private async aiQuestions(
    selectedCategories,
    categories,
  ) {
    const responses = [];
    for (const category of selectedCategories) {
      const inputString = categories[category]
        .map(
          (c) =>
            `key: ${c.key}, level: ${c.level}`,
        )
        .join(', ');

      try {
        const response =
          await this.langchainService.process(
            inputString,
          );

        const questionParts = response
          .split(',')[0]
          .split(': ');
        const question =
          questionParts.length > 2
            ? questionParts[2]
            : questionParts[1];

        const level = response
          .split(',')[1]
          .split(': ')[1];
        const answersSection =
          response.split('Answers: ')[1];
        const answers = answersSection
          ? answersSection
              .split(', ')
              .concat('None')
          : ['None'];

        responses.push({
          Category: category,
          Question: question,
          level: level,
          Answers: answers,
        });
      } catch (error) {
        throw new InternalServerErrorException(
          `Failed to process category: ${category}. Error: ${error.message}`,
        );
      }
    }
    return {
      questions: responses,
      method: 'AI',
    };
  }

  private fallback(
    selectedCategories,
    categories,
  ) {
    const responses = [];
    for (const category of selectedCategories) {
      const inputString = categories[category]
        .map(
          (c) =>
            `key: ${c.key}, level: ${c.level}`,
        )
        .join(', ');

      const response =
        this.findQuestionFromExamples(
          inputString,
        );
      if (response) {
        const questionParts = response
          .split(',')[0]
          .split(': ');
        const question =
          questionParts.length > 2
            ? questionParts[2]
            : questionParts[1];

        const level = response
          .split(',')[1]
          .split(': ')[1];
        const answersSection =
          response.split('Answers: ')[1];
        const answers = answersSection
          ? answersSection
              .split(', ')
              .concat('None')
          : ['None'];

        responses.push({
          Category: category,
          Question: question,
          level: level,
          Answers: answers,
        });
      } else {
        throw new NotFoundException(
          `No fallback question found for category: ${category}.`,
        );
      }
    }
    return {
      questions: responses,
      method: 'fallback',
    };
  }

  private findQuestionFromExamples(inputString) {
    console.log(inputString);
    for (const example of examples) {
      if (
        example.Input.toLowerCase() ===
        inputString
      ) {
        return example.Response;
      }
    }
    throw new NotFoundException(
      `Example not found for input: ${inputString} in fallback method.`,
    );
  }
}

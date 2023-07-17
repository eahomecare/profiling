import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Controller('question')
export class QuestionController {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  @Post('process')
  async processSurvey(
    @Body() payload: any,
  ): Promise<any> {
    const { history, customerId, keywords } =
      payload;
    console.log('payload', payload);

    if (Array.isArray(keywords) && keywords.length > 0) {
      const keywordIds = keywords.map((keyword) => keyword);

      await this.prisma.keyword.updateMany({
        where: { id: { in: keywordIds } },
        data: { customerIDs: { push: customerId } },
      });

      await this.prisma.customer.update({
        where: { id: customerId },
        data: { keywordIDs: { push: keywordIds } },
      });
    }

    for (const item of history) {
      const {
        id,
        question,
        answers,
        category,
        level,
        selectedAnswers,
        type,
      } = item;

      if (
        selectedAnswers &&
        selectedAnswers.length > 0
      ) {
        const createdQuestion =
          await this.prisma.question.create({
            data: {
              question,
              level,
              category,
              type,
              options: answers.map(
                (answer) => answer.text,
              ),
              customerIDs: [customerId],
            },
          });

        for (const answer of answers) {
          if (
            selectedAnswers.includes(answer.id)
          ) {
            const createdKeyword =
              await this.prisma.keyword.create({
                data: {
                  category: category,
                  value: answer.text,
                  level: level,
                  customerIDs: [customerId],
                  questionIDs: [
                    createdQuestion.id,
                  ],
                },
              });
            await this.prisma.customer.update({
              where: { id: customerId },
              data: {
                keywordIDs: {
                  push: createdKeyword.id,
                },
              },
            });
          }
        }
      }
    }

    return {
      message: 'Survey processed successfully.',
    };
  }
}

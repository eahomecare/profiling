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

  @Post('api/process')
  async processSurvey(
    @Body() payload: any,
  ): Promise<any> {
    const { history, customerId } = payload;
    console.log('payload', payload)

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

      if (selectedAnswers && selectedAnswers.length > 0) {
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
              customerIDs: [
                customerId,
              ],
            },
          });

        for (const answer of answers) {
          if (selectedAnswers.includes(
            answer.id,
          )) {
            const createdKeyword = await this.prisma.keyword.create({
              data: {
                category: category,
                value: answer.text,
                level: level,
                customerIDs: [
                  customerId,
                ],
                questionIDs: [createdQuestion.id],
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

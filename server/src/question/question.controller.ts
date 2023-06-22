import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Controller('question')
export class QuestionControllerController {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  @Post('process')
  async processSurvey(
    @Body() payload: any,
  ): Promise<any> {
    const { history, customerId } = payload;

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

      const createdQuestion =
        await this.prisma.question.create({
          data: {
            id: id.toString(),
            question,
            level,
            category,
            type,
            options: answers.map(
              (answer) => answer.text,
            ),
            customerIDs: [
              selectedAnswers.length > 0 &&
                customerId,
            ],
          },
        });

      for (const answer of answers) {
        await this.prisma.keyword.create({
          data: {
            category: item.category,
            value: answer.text,
            level: item.level,
            customerIDs: [
              selectedAnswers.includes(
                answer.id,
              ) && customerId,
            ],
            questionIDs: [createdQuestion.id],
          },
        });
      }
    }

    return {
      message: 'Survey processed successfully.',
    };
  }
}

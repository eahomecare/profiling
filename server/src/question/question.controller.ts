import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Controller('question')
export class QuestionController {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  @Post('process')
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
            await this.prisma.keyword.create({
              data: {
                category: item.category,
                value: answer.text,
                level: item.level,
                customerIDs: [
                  customerId,
                ],
                questionIDs: [createdQuestion.id],
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

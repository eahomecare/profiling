import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly prisma: PrismaService) { }

  @Post('process')
  async processSurvey(@Body() payload: any): Promise<any> {
    const { history, customerId } = payload;

    for (const item of history) {
      const { id, question, answers, category, level, selectedAnswers, type } = item;

      const createdQuestion = await this.prisma.question.create({
        data: {
          id: undefined,
          question,
          level,
          category,
          options: answers.map((answer) => answer.text),
          customers: {
            connect: selectedAnswers.length > 0 ? { id: customerId } : undefined,
          },
        },
      });

      for (const answer of answers) {
        await this.prisma.keyword.create({
          data: {
            category: item.category,
            value: answer.text,
            level: item.level,
            customers: {
              connect: selectedAnswers.includes(answer.id) ? { id: customerId } : undefined,
            },
            questions: {
              connect: { id: createdQuestion.id },
            },
          },
        });
      }
    }

    return {
      message: 'Survey processed successfully.',
    };
  }
}

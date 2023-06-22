import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [QuestionController],
  providers: [PrismaService],
})
export class QuestionModule {}

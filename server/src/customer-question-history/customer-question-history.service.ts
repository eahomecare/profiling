import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerQuestionHistory } from '@prisma/client';

// import { PrismaService } from 'path-to-your-prisma-service/prisma.service';
// import { CustomerQuestionHistory } from 'path-to-your-prisma-service/prisma-client';

@Injectable()
export class CustomerQuestionHistoryService {
  constructor(private prisma: PrismaService) {}

  async createQuestionHistory(
    customerId: string,
    history: object,
  ): Promise<CustomerQuestionHistory> {
    return this.prisma.customerQuestionHistory.create(
      {
        data: {
          customerId,
          historyLogs: history,
        },
      },
    );
  }

  async getQuestionHistory(
    customerId: string,
  ): Promise<CustomerQuestionHistory | null> {
    return this.prisma.customerQuestionHistory.findUnique(
      {
        where: {
          customerId,
        },
      },
    );
  }
}

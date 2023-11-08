import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CustomerSessionService {
  private readonly logger = new Logger(
    CustomerSessionService.name,
  );

  constructor(private prisma: PrismaService) {}
  async upsertCustomerSession(
    customerId: string,
    sessionId: string,
  ): Promise<any> {
    console.log('sessionId', sessionId);
    try {
      let session =
        await this.prisma.customerSession.findUnique(
          {
            where: { customerId },
          },
        );

      if (
        session &&
        session.sessionId !== sessionId
      ) {
        await this.prisma.customerSession.delete({
          where: { customerId },
        });
        session = null;
      }

      if (!session) {
        session =
          await this.prisma.customerSession.create(
            {
              data: {
                sessionId,
                questionStates: {},
                customer: {
                  connect: { id: customerId },
                },
              },
            },
          );
      }

      return session;
    } catch (error) {
      this.logger.error(
        `Failed to upsert customer session for customer ID ${customerId}`,
        error,
      );
      throw new InternalServerErrorException(
        'Could not upsert customer session',
      );
    }
  }

  async getCustomerSession(
    customerId: string,
  ): Promise<any> {
    try {
      const session =
        await this.prisma.customerSession.findUnique(
          {
            where: { customerId },
            select: {
              questionStates: true,
            },
          },
        );

      if (!session) {
        throw new NotFoundException(
          'Customer session not found',
        );
      }

      return session;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to get customer session for customer ID ${customerId}`,
        error,
      );
      throw new InternalServerErrorException(
        'Could not get customer session',
      );
    }
  }

  async updateSessionQuestion(
    customerId: string,
    questionNumber: number,
    category: string,
  ): Promise<any> {
    try {
      const session =
        await this.getCustomerSession(customerId);

      const updatedQuestionStates = {
        ...session.questionStates,
        [questionNumber]: category,
      };

      return await this.prisma.customerSession.update(
        {
          where: { customerId },
          data: {
            questionStates: updatedQuestionStates,
          },
        },
      );
    } catch (error) {
      this.logger.error(
        `Failed to update session question for customer ID ${customerId}`,
        error,
      );
      throw new InternalServerErrorException(
        'Could not update session question',
      );
    }
  }

  async deleteCustomerSession(
    customerId: string,
  ): Promise<any> {
    try {
      return await this.prisma.customerSession.delete(
        {
          where: { customerId },
        },
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete customer session for customer ID ${customerId}`,
        error,
      );
      throw new InternalServerErrorException(
        'Could not delete customer session',
      );
    }
  }

  async clearSessionQuestion(
    customerId: string,
    questionNumber: number,
  ): Promise<any> {
    try {
      const session =
        await this.getCustomerSession(customerId);

      const updatedQuestionStates = {
        ...session.questionStates,
      };
      delete updatedQuestionStates[
        questionNumber
      ];

      return await this.prisma.customerSession.update(
        {
          where: { customerId },
          data: {
            questionStates: updatedQuestionStates,
          },
        },
      );
    } catch (error) {
      this.logger.error(
        `Failed to clear session question for customer ID ${customerId}`,
        error,
      );
      throw new InternalServerErrorException(
        'Could not clear session question',
      );
    }
  }
}

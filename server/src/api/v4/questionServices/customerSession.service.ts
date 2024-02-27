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
    this.logger.log(
      `Starting upsertCustomerSession for customer ID ${customerId}`,
    );
    try {
      this.logger.log(
        `Finding unique customer session for ID ${customerId}`,
      );
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
        this.logger.log(
          `Deleting existing session for customer ID ${customerId}`,
        );
        await this.prisma.customerSession.delete({
          where: { customerId },
        });
        session = null;
      }

      if (!session) {
        this.logger.log(
          `Creating new session for customer ID ${customerId}`,
        );
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

      this.logger.log(
        `Upsert completed successfully for customer ID ${customerId}`,
      );
      return session;
    } catch (error) {
      this.logger.error(
        `Failed to upsert customer session for customer ID ${customerId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Could not upsert customer session',
      );
    }
  }

  async getCustomerSession(
    customerId: string,
  ): Promise<any> {
    this.logger.log(
      `Starting getCustomerSession for customer ID ${customerId}`,
    );
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

      this.logger.log(
        `Session retrieval completed successfully for customer ID ${customerId}`,
      );
      return session;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to get customer session for customer ID ${customerId}`,
        error.stack,
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
    this.logger.log(
      `Starting updateSessionQuestion for customer ID ${customerId}`,
    );
    try {
      this.logger.log(
        `Retrieving session for update operation for customer ID ${customerId}`,
      );
      const session =
        await this.getCustomerSession(customerId);

      const updatedQuestionStates = {
        ...session.questionStates,
        [questionNumber]: category,
      };

      this.logger.log(
        `Updating session question for customer ID ${customerId}`,
      );
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
        error.stack,
      );
      throw new InternalServerErrorException(
        'Could not update session question',
      );
    }
  }

  async deleteCustomerSession(
    customerId: string,
  ): Promise<any> {
    this.logger.log(
      `Starting deleteCustomerSession for customer ID ${customerId}`,
    );
    try {
      return await this.prisma.customerSession.delete(
        {
          where: { customerId },
        },
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete customer session for customer ID ${customerId}`,
        error.stack,
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
    this.logger.log(
      `Starting clearSessionQuestion for customer ID ${customerId}`,
    );
    try {
      this.logger.log(
        `Retrieving session for clearing question for customer ID ${customerId}`,
      );
      const session =
        await this.getCustomerSession(customerId);

      const updatedQuestionStates = {
        ...session.questionStates,
      };
      delete updatedQuestionStates[
        questionNumber
      ];

      this.logger.log(
        `Clearing session question for customer ID ${customerId}`,
      );
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
        error.stack,
      );
      throw new InternalServerErrorException(
        'Could not clear session question',
      );
    }
  }
}

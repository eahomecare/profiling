import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { CustomerSessionService } from './questionServices/customerSession.service';
import { Question1Service } from './questionServices/question1.service';
import { Question2Service } from './questionServices/question2.service';
import { Question3Service } from './questionServices/question3.service';
import { Question4Service } from './questionServices/question4.service';

@Injectable()
export class AgentQuestionService {
  constructor(
    private readonly question1Service: Question1Service,
    private readonly question2Service: Question2Service,
    private readonly question3Service: Question3Service,
    private readonly question4Service: Question4Service,
    private readonly customerSessionService: CustomerSessionService,
  ) {}

  async getQuestionsForCustomer(
    customer: Customer,
    questionNumber: number,
    sessionId: string,
    serviceId?: string,
    currentKeywords?: any[],
  ) {
    if (!customer) {
      throw new UnauthorizedException(
        'No customer provided',
      );
    }

    console.log(
      'agentQuestion sessionId',
      sessionId,
    );

    const sessionObject =
      await this.customerSessionService
        .upsertCustomerSession(
          customer.id,
          sessionId,
        )
        .then(
          (session) => session.questionStates,
        );

    switch (questionNumber) {
      case 1:
        return this.question1Service.handleQuestion(
          customer,
          serviceId,
        );
      case 2:
        return this.question2Service.handleQuestion(
          customer,
          sessionObject,
        );
      case 3:
        return this.question3Service.handleQuestion(
          customer,
          sessionObject,
        );
      case 4:
        return this.question4Service.handleQuestion(
          customer,
          currentKeywords,
        );
      default:
        throw new UnauthorizedException(
          'Invalid question number',
        );
    }
  }
}

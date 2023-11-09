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
import homecareServiceDump from './questionServices/serviceMappings/homecareServiceDump';

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
    serviceId?: number,
    subServiceId?: number,
    currentKeywords?: any[],
  ) {
    if (!customer) {
      throw new UnauthorizedException(
        'Customer not found',
      );
    }

    console.log(
      'agentQuestion sessionId',
      sessionId,
    );

    const serviceObject = {
      serviceTitle: '',
      serviceDescription: '',
    };

    if (serviceId) {
      const service = homecareServiceDump.find(
        (s) => s.serviceId === serviceId,
      );
      if (service) {
        serviceObject.serviceTitle =
          service.serviceTitle;
        serviceObject.serviceDescription =
          service.serviceDescription;

        if (subServiceId) {
          const subService =
            service.subServices.find(
              (sub) => sub.id === subServiceId,
            );
          if (subService) {
            serviceObject.serviceDescription += ` ${subService.description}`;
          }
        }
      }
    }

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
          serviceObject,
          currentKeywords,
          sessionObject,
        );
      case 2:
        return this.question2Service.handleQuestion(
          customer,
          sessionObject,
          serviceObject,
        );
      case 3:
        return this.question3Service.handleQuestion(
          customer,
          sessionObject,
          serviceObject,
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

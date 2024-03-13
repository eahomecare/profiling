import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { V4Controller } from './v4.controller';
import { RegisterAgentService } from './registerAgent.service';
import { CreateAgentSessionService } from './createAgentSession.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthorizationService } from './authorization.service';
import { LogoutAgentService } from './logoutAgent.service';
import { ValidateAgentTokenService } from './validateAgentToken.service';
import { KeywordsService } from './agentKeyword.service';
import { SearchModule } from 'src/search/search.module';
import { LangchainService } from 'src/langchain/langchain.service';
import { SubmitService } from './agentSubmit.service';
import { CustomerLookupService } from './customerLookup.service';
import { CryptoService } from './crypto.service';
import { ProfileTypeService } from './profileType.service';
import { AiEngineService } from './questionServices/engines/v1/aiEngine.service';
import { Question1Service } from './questionServices/question1.service';
import { Question2Service } from './questionServices/question2.service';
import { Question3Service } from './questionServices/question3.service';
import { Question4Service } from './questionServices/question4.service';
import { AgentQuestionService } from './agentQuestion.service';
import { CategoryResolverService } from './questionServices/categoryResolver.service';
import { CustomerSessionService } from './questionServices/customerSession.service';
import { ProfileTypeCustomerMappingService } from 'src/profile-type-customer-mapping/profile-type-customer-mapping.service';
import { ServiceResolverService } from './questionServices/serviceResolver.service';
import { CampaignService } from './campaign.service';
import { ValuationService } from './valuation.service';
import { PersonaService } from './persona.service';
import { ContextService } from './context.service';
import { ProfileCountWidgetService } from 'src/widgets/profileCountWidget.service';
import { CustomerElasticService } from 'src/customer/customerElastic.service';

@Module({
  imports: [ConfigModule, SearchModule],
  controllers: [V4Controller],
  providers: [
    RegisterAgentService,
    CreateAgentSessionService,
    PrismaService,
    AuthorizationService,
    LogoutAgentService,
    ValidateAgentTokenService,
    KeywordsService,
    LangchainService,
    SubmitService,
    CustomerLookupService,
    CryptoService,
    ProfileTypeService,
    AiEngineService,
    Question1Service,
    Question2Service,
    Question3Service,
    Question4Service,
    AgentQuestionService,
    CategoryResolverService,
    CustomerSessionService,
    ProfileTypeCustomerMappingService,
    ServiceResolverService,
    CampaignService,
    ValuationService,
    PersonaService,
    ContextService,
    CustomerElasticService,
    ProfileCountWidgetService,
  ],
})
export class V4Module {}

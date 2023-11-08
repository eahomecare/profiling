import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { V3Controller } from './v3.controller';
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

@Module({
  imports: [ConfigModule, SearchModule],
  controllers: [V3Controller],
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
  ],
})
export class V3Module {}

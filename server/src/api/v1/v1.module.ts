import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { V1Controller } from './v1.controller';
import { RegisterAgentService } from './registerAgent.service';
import { CreateAgentSessionService } from './createAgentSession.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthorizationService } from './authorization.service';
import { LogoutAgentService } from './logoutAgent.service';
import { ValidateAgentTokenService } from './validateAgentToken.service';
import { KeywordsService } from './agentKeyword.service';
import { SearchModule } from 'src/search/search.module';
import { AgentQuestionService } from './agentQuestion.service';
import { LangchainService } from 'src/langchain/langchain.service';
import { SubmitService } from './agentSubmit.service';

@Module({
  imports: [ConfigModule, SearchModule],
  controllers: [V1Controller],
  providers: [RegisterAgentService, CreateAgentSessionService, PrismaService, AuthorizationService, LogoutAgentService, ValidateAgentTokenService, KeywordsService, AgentQuestionService, LangchainService, SubmitService],
})
export class V1Module { }
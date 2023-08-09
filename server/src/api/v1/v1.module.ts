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

@Module({
  imports: [ConfigModule],
  controllers: [V1Controller],
  providers: [RegisterAgentService, CreateAgentSessionService, PrismaService, AuthorizationService, LogoutAgentService, ValidateAgentTokenService, KeywordsService],
})
export class V1Module { }
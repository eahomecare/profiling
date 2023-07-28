import { Module } from '@nestjs/common';
import { V1Controller } from './v1.controller';
import { V1Service } from './v1.service';
import { AgentSessionService } from './agent-session.service';

@Module({
  controllers: [V1Controller],
  providers: [V1Service, AgentSessionService]
})
export class V1Module { }

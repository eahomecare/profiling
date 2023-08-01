import { Injectable } from '@nestjs/common';
import { RegisterAgentService } from './registerAgent.service';
import { CreateAgentSessionService } from './createAgentSession.service';
import { CreateAgentSessionDto } from './dto/agent-session.dto';
import { LogoutAgentService } from './logoutAgent.service';

@Injectable()
export class V1Service {
    constructor(
        private readonly registerAgentService: RegisterAgentService,
        private readonly createAgentSessionService: CreateAgentSessionService,
        private readonly logoutAgentService: LogoutAgentService,
    ) { }

    async registerAgent(data) {
        return this.registerAgentService.registerAgent(data);
    }

    async createAgentSession(dto: CreateAgentSessionDto, crmName: string) {
        return this.createAgentSessionService.create(dto, crmName);
    }

    async logoutAgent(authorizationToken: string, crmName: string) {
        return this.logoutAgentService.logout(authorizationToken, crmName);
    }
}
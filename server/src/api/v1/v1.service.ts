import { Injectable } from '@nestjs/common';
import { RegisterAgentService } from './registerAgent.service';
import { CreateAgentSessionService } from './createAgentSession.service';
import { CreateAgentSessionDto } from './dto/agent-session.dto';

@Injectable()
export class V1Service {
    constructor(
        private readonly registerAgentService: RegisterAgentService,
        private readonly createAgentSessionService: CreateAgentSessionService,
    ) { }

    async registerAgent(data) {
        return this.registerAgentService.registerAgent(data);
    }

    async createAgentSession(dto: CreateAgentSessionDto, crmName: string) {
        return this.createAgentSessionService.create(dto, crmName);
    }
}
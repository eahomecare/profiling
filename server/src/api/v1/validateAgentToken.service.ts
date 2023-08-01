import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ValidateAgentTokenService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async validate(agentAuthorizationToken: string) {
        const existingSession = await this.prisma.agentSession.findUnique({
            where: { authorizationToken: agentAuthorizationToken },
        });

        if (!existingSession) {
            throw new UnauthorizedException('Agent token validation failed');
        }

        return { message: 'Agent token validated', success: true };
    }
}
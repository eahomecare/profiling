import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AgentSession } from '@prisma/client';

@Injectable()
export class ValidateAgentTokenService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async validate(agentAuthorizationToken: string): Promise<AgentSession> {
        try {
            const existingSession = await this.prisma.agentSession.findUnique({
                where: { authorizationToken: agentAuthorizationToken },
            });

            if (!existingSession) {
                throw new UnauthorizedException('Invalid agent token');
            }

            return existingSession;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            // Handle unexpected errors like database connection problems
            throw new InternalServerErrorException('Failed to validate agent token due to internal server error');
        }
    }
}
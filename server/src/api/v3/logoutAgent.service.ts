import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LogoutAgentService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async logout(authorizationToken: string, crmName: string) {
        const existingSession = await this.prisma.agentSession.findUnique({
            where: { authorizationToken },
        });

        if (!existingSession || existingSession.CRM !== crmName) {
            throw new UnauthorizedException('Session not found');
        }

        await this.prisma.agentSession.delete({
            where: { id: existingSession.id },
        });

        return { message: 'Agent successfully logged out' };
    }
}
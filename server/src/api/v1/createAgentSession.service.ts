import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { CreateAgentSessionDto } from './dto/agent-session.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class CreateAgentSessionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
    ) { }

    async create(
        createAgentSessionDto: CreateAgentSessionDto,
        crmName: string,
    ) {
        const user = await this.prisma.user.findUnique({
            where: { agentJWT: createAgentSessionDto.agentAuthenticationKey },
        });


        if (!user) {
            throw new UnauthorizedException('Invalid agent authentication key');
        }

        const agentSessions = await this.prisma.agentSession.findMany({
            where: { CRM: crmName },
        });

        for (const agentSession of agentSessions) {
            const existingSession = await this.prisma.userAgentSessionMapping.findUnique({
                where: { userId_sessionId: { userId: user.id, sessionId: agentSession.id } },
            });

            if (existingSession) {
                await this.prisma.userAgentSessionMapping.delete({
                    where: { id: existingSession.id },
                });

                await this.prisma.agentSession.delete({
                    where: { id: existingSession.sessionId },
                });

                // throw new UnauthorizedException('Existing session found and destroyed');
            }
        }

        const randomValue = randomBytes(16).toString('hex');
        const secret = this.configService.get('JWT_SECRET');

        const authorizationToken = sign(
            { agentAuthenticationKey: createAgentSessionDto.agentAuthenticationKey, randomValue },
            secret,
        );

        await this.prisma.agentSession.create({
            data: {
                CRM: crmName,
                authorizationToken,
                userAgentSessionMapping: {
                    create: { user: { connect: { id: user.id } } },
                },
            },
        });

        return { agentAuthorizationToken: authorizationToken };
    }
}
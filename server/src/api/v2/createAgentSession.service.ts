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

        const existingSessions = await this.prisma.agentSession.findMany({
            where: {
                userId: user.id,
                CRM: crmName
            },
            select: { id: true }
        });

        if (existingSessions.length > 0) {
            for (let existingSession of existingSessions) {
                await this.prisma.agentSession.delete({
                    where: { id: existingSession.id },
                });
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
                userId: user.id,
            },
        });

        return { agentAuthorizationToken: authorizationToken };
    }
}

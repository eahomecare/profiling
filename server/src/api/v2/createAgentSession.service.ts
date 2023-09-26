import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateAgentSessionDto } from './dto/agent-session.dto';
import { sign } from 'jsonwebtoken';
import { CryptoService } from './crypto.service';

@Injectable()
export class CreateAgentSessionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly cryptoService: CryptoService,
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
                console.log(`Existing sessions deleted at ${new Date()}`, existingSession)
                await this.prisma.agentSession.delete({
                    where: { id: existingSession.id },
                });
            }
        }

        const secret = this.configService.get('JWT_SECRET');

        const toBeEncrypted = JSON.stringify({ agentAuthenticationKey: createAgentSessionDto.agentAuthenticationKey })
        const authorizationToken = sign(
            this.cryptoService.encrypt(toBeEncrypted),
            secret,
        );

        const newSession = await this.prisma.agentSession.create({
            data: {
                CRM: crmName,
                authorizationToken,
                userId: user.id,
            },
        });
        console.log('New session created', newSession)

        return { agentAuthorizationToken: authorizationToken };
    }
}

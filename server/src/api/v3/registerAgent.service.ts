import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { AuthorizationService } from './authorization.service';
import { CryptoService } from './crypto.service'

@Injectable()
export class RegisterAgentService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
        private authorizationService: AuthorizationService,
        private cryptoService: CryptoService
    ) { }

    async registerAgent(data) {
        const { staticKey, ID, name, email, mobile } = data;
        const crmName = this.authorizationService.validateCrm(staticKey);

        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email },
                include: { role: true },
            });

            if (existingUser) {
                let isAgent = existingUser.role && existingUser.role.name == 'agent';

                if (isAgent) {
                    if (!existingUser.agentCRM.includes(crmName)) {
                        await this.prisma.user.update({
                            where: { id: existingUser.id },
                            data: {
                                agentCRM: {
                                    set: [...existingUser.agentCRM, crmName],
                                },
                            },
                        });
                    }

                    return {
                        status: 200,
                        message: 'Agent already exists',
                        agentAuthenticationKey: existingUser.agentJWT,
                    }
                } else {
                    const agentRole = await this.prisma.role.findUnique({
                        where: { name: 'agent' },
                    });

                    if (!agentRole) {
                        throw new NotFoundException("Agent role not found in the system.");
                    }

                    const JWT_SECRET = this.configService.get('JWT_SECRET');
                    if (!JWT_SECRET) {
                        throw new InternalServerErrorException('Configuration error.');
                    }

                    const toBeEncrypted = JSON.stringify(data)
                    const agentJWT = jwt.sign(this.cryptoService.encrypt(toBeEncrypted), JWT_SECRET);

                    await this.prisma.user.update({
                        where: { id: existingUser.id },
                        data: {
                            agentJWT,
                            agentCRM: {
                                set: [crmName],
                            },
                        },
                    });

                    return {
                        status: 201,
                        message: "Agent role added to an existing user",
                        agentAuthenticationKey: agentJWT
                    }
                }
            } else {
                const agentRole = await this.prisma.role.findUnique({
                    where: { name: 'agent' },
                    include: { defaultPermissions: true },
                });

                if (!agentRole) {
                    throw new NotFoundException("Agent role not found in the system.");
                }

                const JWT_SECRET = this.configService.get('JWT_SECRET');
                if (!JWT_SECRET) {
                    throw new InternalServerErrorException('Configuration error.');
                }

                const toBeEncrypted = JSON.stringify(data)
                const agentJWT = jwt.sign(this.cryptoService.encrypt(toBeEncrypted), JWT_SECRET);

                const newUser = await this.prisma.user.create({
                    data: {
                        agentID: ID,
                        agentJWT,
                        agentName: name,
                        email,
                        mobile,
                        roleId: agentRole.id,
                        agentCRM: {
                            set: [crmName],
                        },
                        hash: '',
                    },
                });

                const userRolePermissionMappingData = agentRole.defaultPermissions.map((permission) => ({
                    roleId: agentRole.id,
                    userId: newUser.id,
                    permissionId: permission.id
                }));

                try {
                    if (userRolePermissionMappingData.length > 0) {
                        await this.prisma.userRolePermissionMapping.createMany({
                            data: userRolePermissionMappingData,
                        });
                    }
                } catch (error) {
                    console.error("Error creating many userRolePermissionMappings:", error);
                    throw new InternalServerErrorException('An error occurred while processing your request.');
                }

                return {
                    status: 201,
                    message: "New user created with agent role",
                    agentAuthenticationKey: newUser.agentJWT
                }
            }
        } catch (error) {
            console.error("Error occurred:", error);
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred while processing your request.');
        }
    }
}
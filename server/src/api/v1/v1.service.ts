import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class V1Service {
    constructor(private prisma: PrismaService) { }

    async registerAgent(data) {
        const { staticKey, ID, name, email, mobile } = data;

        if (staticKey !== process.env.HC_STATIC_KEY) {
            throw new BadRequestException('Invalid static key');
        }

        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email },
                include: { userRolePermissionMapping: { include: { role: true } } },
            });

            if (existingUser) {
                const isAgent = existingUser.userRolePermissionMapping.some(
                    (userRole) => userRole.role.name === 'agent',
                );

                if (isAgent) {
                    // throw new BadRequestException('Agent already exists');
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
                        throw new NotFoundException('Agent role not found');
                    }

                    const agentJWT = jwt.sign(data, process.env.JWT_SECRET);

                    await this.prisma.user.update({
                        where: { id: existingUser.id },
                        data: {
                            agentJWT,
                            agentCRM: ['HC'],
                            userRolePermissionMapping: {
                                create: {
                                    roleId: agentRole.id,
                                },
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
                });

                if (!agentRole) {
                    throw new NotFoundException('Agent role not found');
                }

                const agentJWT = jwt.sign(data, process.env.JWT_SECRET);

                const newUser = await this.prisma.user.create({
                    data: {
                        agentID: ID,
                        agentJWT,
                        agentName: name,
                        email,
                        mobile,
                        agentCRM: ['HC'],
                        hash: '', // Hash needs to be generated when upgrading agent to other roles
                        userRolePermissionMapping: {
                            create: {
                                roleId: agentRole.id,
                            },
                        },
                    },
                });

                return {
                    status: 201,
                    message: "New user created with agent role",
                    agentAuthenticationKey: newUser.agentJWT
                }
            }
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Database error');
        }
    }
}
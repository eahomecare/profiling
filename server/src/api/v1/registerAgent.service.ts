import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { AuthorizationService } from './authorization.service';



@Injectable()
export class RegisterAgentService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
        private authorizationService: AuthorizationService
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
                let isAgent = false;
                for (const userRole of existingUser.role) {
                    if (userRole.name === 'agent') {
                        isAgent = true;
                        break;
                    }
                }



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
                        await this.prisma.role.create({
                            data: {
                                name: 'agent'
                            }
                        })
                    }



                    const JWT_SECRET = this.configService.get('JWT_SECRET');
                    const agentJWT = jwt.sign(data, JWT_SECRET);



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
                    where: { name: 'agent' }, include: { defaultPermissions: true },
                });

                const JWT_SECRET = this.configService.get('JWT_SECRET');
                const agentJWT = jwt.sign(data, JWT_SECRET);



                const newUser = await this.prisma.user.create({
                    data: {
                        agentID: ID,
                        agentJWT,
                        agentName: name,
                        email,
                        mobile,
                        roleIds: agentRole.id,
                        agentCRM: {
                            set: [crmName],
                        },
                        hash: '', // Hash needs to be generated when upgrading agent to other roles

                    },
                });

                const userRolePermissionMappingData = agentRole.defaultPermissions.map((permission) => ({
                    roleId: agentRole.id,
                    userId: newUser.id,
                    permissionId: permission.id
                }));

                await this.prisma.userRolePermissionMapping.createMany({
                    data: userRolePermissionMappingData,
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
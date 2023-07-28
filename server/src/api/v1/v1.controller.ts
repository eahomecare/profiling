import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Res,
    Req,
    Headers,
    ValidationPipe,
    UnauthorizedException,
    UsePipes
} from '@nestjs/common';
import { Request, Response } from 'express';
import { V1Service } from './v1.service';
import { RegisterAgentDto } from './dto/register-agent.dto';
import { ConfigService } from '@nestjs/config';
import { CreateAgentSessionDto } from './dto/agent-session.dto';
import { AgentSessionService } from './agent-session.service';

@Controller('api/v1')
export class V1Controller {
    constructor(
        private readonly v1Service: V1Service,
        private readonly agentSessionService: AgentSessionService,
        private readonly configService: ConfigService,
    ) { }

    @Post('/register')
    async registerAgent(
        @Req() request: Request,
        @Body(new ValidationPipe({ exceptionFactory: (errors) => new HttpException(errors, HttpStatus.BAD_REQUEST) })) registerAgentDto: RegisterAgentDto,
        @Res() res: Response
    ) {
        try {
            const authorizationHeader = request.headers.authorization;
            if (!authorizationHeader)
                throw new HttpException('No Authorization Header Present', HttpStatus.UNAUTHORIZED)

            const encodedStaticKey = authorizationHeader.split(' ')[1];
            if (!encodedStaticKey)
                throw new HttpException('Invalid Authorization Format', HttpStatus.UNAUTHORIZED)

            const staticKey = Buffer.from(encodedStaticKey, 'base64').toString();

            const data = { ...registerAgentDto, staticKey };
            const msg = await this.v1Service.registerAgent(data);

            res.status(HttpStatus.CREATED).json({ ...msg, success: true });
        } catch (error) {
            let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            let message = 'Internal server error';

            if (error instanceof HttpException) {
                statusCode = error.getStatus();
                message = error.message;
            }

            res.status(statusCode).json({
                success: false,
                status: statusCode,
                message: message
            });
        }
    }

    @Post('/login')
    async loginAgent(
        @Req() request: Request,
        @Body(new ValidationPipe({ exceptionFactory: (errors) => new HttpException(errors, HttpStatus.BAD_REQUEST) })) createAgentSessionDto: CreateAgentSessionDto,
        @Res() res: Response
    ) {
        try {
            const authorizationHeader = request.headers.authorization;
            if (!authorizationHeader)
                throw new HttpException('No Authorization Header Present', HttpStatus.UNAUTHORIZED)

            const encodedStaticKey = authorizationHeader.split(' ')[1];
            if (!encodedStaticKey)
                throw new HttpException('Invalid Authorization Format', HttpStatus.UNAUTHORIZED)

            const staticKey = Buffer.from(encodedStaticKey, 'base64').toString();

            const crmNames = ['HC', 'CRM2', 'CRM3']; // update this with the actual CRM names
            const crmName = crmNames.find(
                (crm) => this.configService.get(crm + '_STATIC_KEY') === staticKey
            );

            if (!crmName) {
                throw new UnauthorizedException('Invalid Static Key');
            }

            const result = await this.agentSessionService.create(createAgentSessionDto, crmName);

            res.status(HttpStatus.OK).json({ success: true, ...result });
        } catch (error) {
            let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            let message = 'Internal server error';

            if (error instanceof HttpException) {
                statusCode = error.getStatus();
                message = error.message;
            }

            res.status(statusCode).json({
                success: false,
                status: statusCode,
                message: message
            });
        }
    }
}
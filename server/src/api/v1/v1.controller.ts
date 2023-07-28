import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Res,
    Req,
    ValidationPipe
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RegisterAgentDto } from './dto/register-agent.dto';
import { ConfigService } from '@nestjs/config';
import { CreateAgentSessionDto } from './dto/agent-session.dto';
import { RegisterAgentService } from './registerAgent.service';
import { CreateAgentSessionService } from './createAgentSession.service';
import { AuthorizationService } from './authorization.service';

@Controller('api/v1')
export class V1Controller {
    constructor(
        private readonly registerAgentService: RegisterAgentService,
        private readonly createAgentSessionService: CreateAgentSessionService,
        private readonly configService: ConfigService,
        private readonly authorizationService: AuthorizationService
    ) { }

    @Post('/register')
    async registerAgent(
        @Req() request: Request,
        @Body(new ValidationPipe({ exceptionFactory: (errors) => new HttpException(errors, HttpStatus.BAD_REQUEST) })) registerAgentDto: RegisterAgentDto,
        @Res() res: Response
    ) {
        try {
            const staticKey = this.authorizationService.validateAndDecodeStaticKey(request);
            const crmName = this.authorizationService.validateCrm(staticKey);
            const data = { ...registerAgentDto, staticKey, crmName };
            const msg = await this.registerAgentService.registerAgent(data);

            res.status(HttpStatus.CREATED).json({ ...msg, success: true });
        } catch (error) {
            this.handleException(error, res);
        }
    }

    @Post('/login')
    async loginAgent(
        @Req() request: Request,
        @Body(new ValidationPipe({ exceptionFactory: (errors) => new HttpException(errors, HttpStatus.BAD_REQUEST) })) createAgentSessionDto: CreateAgentSessionDto,
        @Res() res: Response
    ) {
        try {
            const staticKey = this.authorizationService.validateAndDecodeStaticKey(request);

            const crmName = this.authorizationService.validateCrm(staticKey);

            const result = await this.createAgentSessionService.create(createAgentSessionDto, crmName);

            res.status(HttpStatus.OK).json({ success: true, ...result });
        } catch (error) {
            this.handleException(error, res);
        }
    }

    private handleException(error: any, res: Response) {
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
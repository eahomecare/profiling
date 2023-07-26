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
import { V1Service } from './v1.service';
import { RegisterAgentDto } from './dto/register-agent.dto';

@Controller('api/v1')
export class V1Controller {
    constructor(private readonly v1Service: V1Service) { }

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
}
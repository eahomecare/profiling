import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { V1Service } from './v1.service';

@Controller('api/v1')
export class V1Controller {
    constructor(private readonly v1Service: V1Service) { }

    @Post('/register')
    async registerAgent(@Body() body, @Res() res: Response) {
        try {
            const agentJWT = await this.v1Service.registerAgent(body);
            res.status(HttpStatus.CREATED).json({ agentJWT });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Res,
    Req
} from '@nestjs/common';
import { Request, Response } from 'express';
import { V1Service } from './v1.service';

@Controller('api/v1')
export class V1Controller {
    constructor(private readonly v1Service: V1Service) { }

    @Post('/register')
    async registerAgent(@Req() request: Request, @Body() body, @Res() res: Response) {
        try {
            const authorizationHeader = request.headers.authorization;
            if (!authorizationHeader)
                throw new HttpException('No Authorization Header Present', HttpStatus.UNAUTHORIZED)

            const encodedStaticKey = authorizationHeader.split(' ')[1];
            if (!encodedStaticKey)
                throw new HttpException('Invalid Authorization Format', HttpStatus.UNAUTHORIZED)

            const staticKey = Buffer.from(encodedStaticKey, 'base64').toString();

            const { ID, name, email, mobile } = body;
            if (!(ID && name && email && mobile))
                throw new HttpException('Missing fields in request body', HttpStatus.BAD_REQUEST)

            const data = { ID, name, email, mobile, staticKey };
            const msg = await this.v1Service.registerAgent(data);

            res.status(HttpStatus.CREATED).json(msg);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
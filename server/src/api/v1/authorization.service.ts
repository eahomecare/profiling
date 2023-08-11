import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthorizationService {
    constructor(private readonly configService: ConfigService) { }

    validateAndDecodeStaticKey(request: Request): string {
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader)
            throw new HttpException('No Authorization Header Present', HttpStatus.UNAUTHORIZED)

        const encodedStaticKey = authorizationHeader.split(' ')[1];
        if (!encodedStaticKey)
            throw new HttpException('Invalid Authorization Format', HttpStatus.UNAUTHORIZED)

        return Buffer.from(encodedStaticKey, 'base64').toString();
    }

    validateCrm(staticKey: string): string {
        const crmNames = ['HC', 'CRM2', 'CRM3']; // update this with the actual CRM names
        const crmName = crmNames.find(
            (crm) => this.configService.get(crm + '_STATIC_KEY') === staticKey
        );

        if (!crmName) {
            throw new UnauthorizedException('Invalid Static Key');
        }

        return crmName;
    }

    decodeAuthorizationToken(request: Request): string {
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader)
            throw new HttpException('No Authorization Header Present', HttpStatus.UNAUTHORIZED);

        const encodedToken = authorizationHeader.split(' ')[1];
        if (!encodedToken)
            throw new HttpException('Invalid Authorization Format', HttpStatus.UNAUTHORIZED);

        return Buffer.from(encodedToken, 'base64').toString();
    }
}
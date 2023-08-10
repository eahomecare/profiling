import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Res,
    Req,
    ValidationPipe,
    UnauthorizedException,
    Delete,
    Get
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RegisterAgentDto } from './dto/register-agent.dto';
import { ConfigService } from '@nestjs/config';
import { CreateAgentSessionDto } from './dto/agent-session.dto';
import { RegisterAgentService } from './registerAgent.service';
import { CreateAgentSessionService } from './createAgentSession.service';
import { AuthorizationService } from './authorization.service';
import { LogoutAgentService } from './logoutAgent.service';
import { KeywordsService } from './agentKeyword.service';
import { ValidateAgentTokenService } from './validateAgentToken.service';
import { ValidateAgentTokenDto } from './dto/validate-agent-token.dto';
import { KeywordsDto } from './dto/agent-keywords.dto';
import { SearchService } from 'src/search/search.service';
import { AgentQuestionService } from './agentQuestion.service';
import { SubmitService } from './agentSubmit.service';
import { SubmitDataDto } from './dto/agent-submit.dto';

@Controller('api/v1')
export class V1Controller {
    constructor(
        private readonly registerAgentService: RegisterAgentService,
        private readonly createAgentSessionService: CreateAgentSessionService,
        private readonly configService: ConfigService,
        private readonly authorizationService: AuthorizationService,
        private readonly logoutAgentService: LogoutAgentService,
        private readonly validateAgentTokenService: ValidateAgentTokenService,
        private readonly keywordsService: KeywordsService,
        private readonly searchService: SearchService,
        private readonly agentQuestionService: AgentQuestionService,
        private readonly submitService: SubmitService,
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

    @Post('/logout')
    async logoutAgent(
        @Req() request: Request,
        @Res() res: Response
    ) {
        try {
            const staticKey = this.authorizationService.validateAndDecodeStaticKey(request);
            const crmName = this.authorizationService.validateCrm(staticKey);

            const authorizationToken = request.body.agentAuthorizationToken;
            if (!authorizationToken) {
                throw new UnauthorizedException('Invalid authorization token');
            }

            const result = await this.logoutAgentService.logout(authorizationToken, crmName);

            res.status(HttpStatus.OK).json({ success: true, ...result });
        } catch (error) {
            this.handleException(error, res);
        }
    }

    @Post('/validate')
    async validateAgentToken(
        @Body(new ValidationPipe({ exceptionFactory: (errors) => new HttpException(errors, HttpStatus.BAD_REQUEST) })) ValidateAgentTokenDto: ValidateAgentTokenDto,
        @Res() res: Response
    ) {
        console.log('token', ValidateAgentTokenDto)
        try {
            const result = await this.validateAgentTokenService.validate(ValidateAgentTokenDto.agentAuthorizationToken);
            res.status(HttpStatus.OK).json(result);
        } catch (error) {
            this.handleException(error, res);
        }
    }

    @Post('/keywords')
    async getKeywords(
        @Req() request: Request,
        @Body(new ValidationPipe({ exceptionFactory: (errors) => new HttpException(errors, HttpStatus.BAD_REQUEST) })) keywordsDto: KeywordsDto,
        @Res() res: Response
    ) {
        try {
            const decodedAuthorizationToken = this.authorizationService.decodeAuthorizationToken(request);
            const agentSession = await this.validateAgentTokenService.validate(decodedAuthorizationToken);

            if (!agentSession) {
                throw new UnauthorizedException('Invalid authorization token');
            }

            const mobileNumber = keywordsDto.mobile;
            const keywords = await this.keywordsService.getKeywordsForMobile(mobileNumber);

            res.status(HttpStatus.OK).json({ success: true, ...keywords });
        } catch (error) {
            this.handleException(error, res);
        }
    }

    @Post('/search')
    async searchKeywords(
        @Req() request: Request,
        @Body() searchDto: { term: string, field: 'category' | 'value' | 'both' },
        @Res() res: Response
    ) {
        console.log('body', searchDto)
        try {
            const decodedAuthorizationToken = this.authorizationService.decodeAuthorizationToken(request);
            const agentSession = await this.validateAgentTokenService.validate(decodedAuthorizationToken);

            if (!agentSession) {
                throw new UnauthorizedException('Invalid authorization token');
            }

            const results = await this.searchService.autocomplete('keywords', searchDto.term, searchDto.field);

            res.status(HttpStatus.OK).json({ success: true, results });
        } catch (error) {
            this.handleException(error, res);
        }
    }

    @Post('/questions')
    async getQuestions(
        @Req() request: Request,
        @Body(new ValidationPipe({ exceptionFactory: (errors) => new HttpException(errors, HttpStatus.BAD_REQUEST) })) questionsDto: KeywordsDto,
        @Res() res: Response
    ) {
        try {
            const decodedAuthorizationToken = this.authorizationService.decodeAuthorizationToken(request);
            const agentSession = await this.validateAgentTokenService.validate(decodedAuthorizationToken);

            if (!agentSession) {
                throw new UnauthorizedException('Invalid authorization token');
            }

            const mobileNumber = questionsDto.mobile;
            const questions = await this.agentQuestionService.getQuestionsForMobile(mobileNumber);

            res.status(HttpStatus.OK).json({ success: true, ...questions });
        } catch (error) {
            this.handleException(error, res);
        }
    }


    @Post('/submit')
    async submitData(
        @Req() request: Request,
        @Body(new ValidationPipe({ exceptionFactory: (errors) => new HttpException(errors, HttpStatus.BAD_REQUEST) })) submitDataDto: SubmitDataDto,
        @Res() res: Response
    ) {
        try {
            const decodedAuthorizationToken = this.authorizationService.decodeAuthorizationToken(request);
            const agentSession = await this.validateAgentTokenService.validate(decodedAuthorizationToken);

            if (!agentSession) {
                throw new UnauthorizedException('Invalid authorization token');
            }

            const customer = await this.submitService.findCustomerByMobile(submitDataDto.mobile);

            if (!customer) {
                throw new UnauthorizedException('No customer found with provided mobile number.');
            }

            const userAgentMapping = await this.submitService.findUserByAgentSession(agentSession.id);
            const agentID = await this.submitService.getAgentIDFromSession(userAgentMapping)

            let agentSubmitData = {
                CRM: agentSession.CRM,
                customerID: customer.id,
                agentID,
                remarks: submitDataDto.remarks || undefined,
                createdKeywords: [],
                questions: [],
                Keywords: [],
            };

            if (submitDataDto.selectedKeywords && submitDataDto.selectedKeywords.length) {
                const connectedKeywords = await this.submitService.connectCustomerToKeywords(customer.id, submitDataDto.selectedKeywords);
                agentSubmitData.Keywords = connectedKeywords.map(keyword => keyword.id);
            }

            if (submitDataDto.questionResponses && submitDataDto.questionResponses.length) {
                const questionsData = await this.submitService.handleQuestionResponses(submitDataDto.questionResponses, customer.id);
                agentSubmitData.questions = questionsData.questions;
                agentSubmitData.Keywords = [...agentSubmitData.Keywords, ...questionsData.keywords];
            }

            let createdKeywordsList = [];
            if (submitDataDto.createdKeywords && submitDataDto.createdKeywords.length) {
                createdKeywordsList = await this.submitService.handleCreatedKeywords(customer.id, userAgentMapping.userId, submitDataDto.createdKeywords);
            }

            await this.submitService.createAgentSubmit(agentSubmitData, createdKeywordsList);

            res.status(HttpStatus.OK).json({ success: true, message: 'Data submitted successfully' });
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
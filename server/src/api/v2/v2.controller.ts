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
  BadRequestException,
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
import { CustomerLookupService } from './customerLookup.service';

@Controller('api/v2')
export class V2Controller {
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
    private readonly customerLookupService: CustomerLookupService,
  ) {}

  @Post('/register')
  async registerAgent(
    @Req() request: Request,
    @Body(
      new ValidationPipe({
        exceptionFactory: (errors) =>
          new HttpException(
            errors,
            HttpStatus.BAD_REQUEST,
          ),
      }),
    )
    registerAgentDto: RegisterAgentDto,
    @Res() res: Response,
  ) {
    try {
      const staticKey =
        this.authorizationService.validateAndDecodeStaticKey(
          request,
        );
      const crmName =
        this.authorizationService.validateCrm(
          staticKey,
        );
      const data = {
        ...registerAgentDto,
        staticKey,
        crmName,
      };
      const msg =
        await this.registerAgentService.registerAgent(
          data,
        );

      res
        .status(HttpStatus.OK)
        .json({ ...msg, success: true });
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @Post('/login')
  async loginAgent(
    @Req() request: Request,
    @Body(
      new ValidationPipe({
        exceptionFactory: (errors) =>
          new HttpException(
            errors,
            HttpStatus.BAD_REQUEST,
          ),
      }),
    )
    createAgentSessionDto: CreateAgentSessionDto,
    @Res() res: Response,
  ) {
    try {
      const staticKey =
        this.authorizationService.validateAndDecodeStaticKey(
          request,
        );

      const crmName =
        this.authorizationService.validateCrm(
          staticKey,
        );

      const result =
        await this.createAgentSessionService.create(
          createAgentSessionDto,
          crmName,
        );

      res
        .status(HttpStatus.OK)
        .json({ success: true, ...result });
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @Post('/logout')
  async logoutAgent(
    @Req() request: Request,
    @Res() res: Response,
  ) {
    try {
      const staticKey =
        this.authorizationService.validateAndDecodeStaticKey(
          request,
        );
      const crmName =
        this.authorizationService.validateCrm(
          staticKey,
        );

      const authorizationToken =
        request.body.agentAuthorizationToken;
      if (!authorizationToken) {
        throw new UnauthorizedException(
          'Invalid authorization token',
        );
      }

      const result =
        await this.logoutAgentService.logout(
          authorizationToken,
          crmName,
        );

      res
        .status(HttpStatus.OK)
        .json({ success: true, ...result });
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @Post('/validate')
  async validateAgentToken(
    @Body(
      new ValidationPipe({
        exceptionFactory: (errors) =>
          new HttpException(
            errors,
            HttpStatus.BAD_REQUEST,
          ),
      }),
    )
    ValidateAgentTokenDto: ValidateAgentTokenDto,
    @Res() res: Response,
  ) {
    console.log('token', ValidateAgentTokenDto);
    try {
      const result =
        await this.validateAgentTokenService.validate(
          ValidateAgentTokenDto.agentAuthorizationToken,
        );
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @Post('/keywords')
  async getKeywords(
    @Req() request: Request,
    @Body(
      new ValidationPipe({
        exceptionFactory: (errors) =>
          new HttpException(
            errors,
            HttpStatus.BAD_REQUEST,
          ),
      }),
    )
    keywordsDto: KeywordsDto,
    @Res() res: Response,
  ) {
    try {
      const decodedAuthorizationToken =
        this.authorizationService.decodeAuthorizationToken(
          request,
        );
      const agentSession =
        await this.validateAgentTokenService.validate(
          decodedAuthorizationToken,
        );

      if (!agentSession) {
        throw new UnauthorizedException(
          'Invalid authorization token',
        );
      }

      const crmName = agentSession.CRM;
      const customer =
        await this.customerLookupService.findCustomerByCRMIdAndName(
          keywordsDto.customerCRMId,
          crmName,
        );
      const keywords =
        await this.keywordsService.getKeywordsForCustomer(
          customer,
        );

      res
        .status(HttpStatus.OK)
        .json({ success: true, ...keywords });
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @Post('/search')
  async searchKeywords(
    @Req() request: Request,
    @Body()
    searchDto: {
      term: string;
      field: 'category' | 'value' | 'both';
    },
    @Res() res: Response,
  ) {
    console.log('body', searchDto);
    try {
      const decodedAuthorizationToken =
        this.authorizationService.decodeAuthorizationToken(
          request,
        );
      const agentSession =
        await this.validateAgentTokenService.validate(
          decodedAuthorizationToken,
        );

      if (!agentSession) {
        throw new UnauthorizedException(
          'Invalid authorization token',
        );
      }

      const results =
        await this.searchService.autocomplete(
          // 'eaprofiling.keywords',
          'keywords',
          searchDto.term,
          searchDto.field,
        );

      res
        .status(HttpStatus.OK)
        .json({ success: true, results });
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @Post('/questions')
  async getQuestions(
    @Req() request: Request,
    @Body(
      new ValidationPipe({
        exceptionFactory: (errors) =>
          new HttpException(
            errors,
            HttpStatus.BAD_REQUEST,
          ),
      }),
    )
    questionsDto: KeywordsDto,
    @Res() res: Response,
  ) {
    try {
      const decodedAuthorizationToken =
        this.authorizationService.decodeAuthorizationToken(
          request,
        );
      const agentSession =
        await this.validateAgentTokenService.validate(
          decodedAuthorizationToken,
        );

      if (!agentSession) {
        throw new UnauthorizedException(
          'Invalid authorization token',
        );
      }

      const crmName = agentSession.CRM;
      const customer =
        await this.customerLookupService.findCustomerByCRMIdAndName(
          questionsDto.customerCRMId,
          crmName,
        );
      const questions =
        await this.agentQuestionService.getQuestionsForCustomer(
          customer,
        );

      res
        .status(HttpStatus.OK)
        .json({ success: true, ...questions });
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @Post('/submit')
  async submitData(
    @Req() request: Request,
    @Body(
      new ValidationPipe({
        exceptionFactory: (errors) =>
          new HttpException(
            errors,
            HttpStatus.BAD_REQUEST,
          ),
      }),
    )
    submitDataDto: SubmitDataDto,
    @Res() res: Response,
  ) {
    try {
      const {
        selectedKeywords,
        remarks,
        createdKeywords,
        questionResponses,
      } = submitDataDto;
      if (
        !selectedKeywords &&
        !remarks &&
        !createdKeywords &&
        !questionResponses
      ) {
        throw new BadRequestException(
          'At least one of selectedKeywords, remarks, createdKeywords, or questionResponses must be provided.',
        );
      }

      const decodedAuthorizationToken =
        this.authorizationService.decodeAuthorizationToken(
          request,
        );
      const agentSession =
        await this.validateAgentTokenService.validate(
          decodedAuthorizationToken,
        );

      if (!agentSession) {
        throw new UnauthorizedException(
          'Invalid authorization token',
        );
      }

      const crmName = agentSession.CRM;
      const customer =
        await this.customerLookupService.findCustomerByCRMIdAndName(
          submitDataDto.customerCRMId,
          crmName,
        );

      if (!customer) {
        throw new UnauthorizedException(
          'No customer found with provided mobile number.',
        );
      }

      const agentID =
        await this.submitService.getAgentIDFromSession(
          agentSession.id,
        );

      const agentSubmitData = {
        CRM: agentSession.CRM,
        customerID: customer.id,
        agentID,
        remarks: submitDataDto.remarks || '',
        questions: [],
        keywords: [],
      };

      if (
        submitDataDto.selectedKeywords &&
        submitDataDto.selectedKeywords.length
      ) {
        const connectedKeywords =
          await this.submitService.connectCustomerToKeywords(
            customer.id,
            submitDataDto.selectedKeywords,
          );
        agentSubmitData.keywords =
          connectedKeywords.map(
            (keyword) => keyword.id,
          );
      }

      if (
        submitDataDto.questionResponses &&
        submitDataDto.questionResponses.length
      ) {
        const questionsData =
          await this.submitService.handleQuestionResponses(
            submitDataDto.questionResponses,
            customer.id,
          );
        agentSubmitData.questions =
          questionsData.questions;
        agentSubmitData.keywords = [
          ...agentSubmitData.keywords,
          ...questionsData.keywords,
        ];
      }

      if (
        submitDataDto.createdKeywords &&
        submitDataDto.createdKeywords.length
      ) {
        agentSubmitData.keywords = [
          ...agentSubmitData.keywords,
          ...(await this.submitService.handleCreatedKeywords(
            customer.id,
            agentID,
            submitDataDto.createdKeywords,
          )),
        ];
      }

      await this.submitService.createAgentSubmit(
        agentSubmitData,
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Data submitted successfully',
      });
    } catch (error) {
      this.handleException(error, res);
    }
  }

  private handleException(
    error: any,
    res: Response,
  ) {
    let statusCode =
      HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (error instanceof HttpException) {
      statusCode = error.getStatus();
      message = error.message;
    }

    res.status(200).json({
      success: false,
      status: statusCode,
      message: message,
    });
  }
}

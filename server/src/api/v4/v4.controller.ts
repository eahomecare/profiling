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
  Get,
  Logger,
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
import { ProfileTypeService } from './profileType.service';
import { QuestionDto } from './dto/agent-question.dto';
import { CampaignService } from './campaign.service';
import { CampaignDto } from './dto/campaign.dto';
import { GetCampaignsDto } from './dto/get-campaign.dto';
import { ValuationService } from './valuation.service';
import { PersonaService } from './persona.service';
import { ContextService } from './context.service';

@Controller('api/v4')
export class V4Controller {
  private readonly logger = new Logger(
    V4Controller.name,
  );
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
    private readonly profileTypeService: ProfileTypeService,
    private readonly campaignService: CampaignService,
    private readonly valuationService: ValuationService,
    private readonly personaService: PersonaService,
    private readonly contextService: ContextService,
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
      this.logger.log('Registering agent');
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
    this.logger.log('Agent Logging In');
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
    this.logger.log('Agent Logging Out');
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

  @Post('/customer-info')
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
    
    this.logger.log('Getting Customer Info');
    try {
      const decodedAuthorizationToken =
        this.authorizationService.decodeAuthorizationToken(
          request,
        );
      const agentSession =
        await this.validateAgentTokenService.validate(
          decodedAuthorizationToken,
        );

      // if (!agentSession) {
      //   throw new UnauthorizedException(
      //     'Invalid authorization token',
      //   );
      // }

      const crmHeader = request.headers['crm']?request.headers['crm']:"HC_CRM";
      const crmName = Array.isArray(crmHeader) ? crmHeader.join(', ') : crmHeader;
      const customer =
        await this.customerLookupService.findCustomerByCRMIdAndName(
          keywordsDto.customerCRMId,
          crmName,
        );
      const keywords =
        await this.keywordsService.getKeywordsForCustomer(
          customer,
        );
      const nameMapping = {
        food: 'Foodie',
        technology: 'Techie',
        gadget: 'Gadget Freak',
        sports: 'Sports Fan',
        automobile: 'Auto Lover',
        fitness: 'Fitness Freak',
        travel: 'Avid Traveller',
        music: 'Musicophile',
      };
      const profileTypes =
        await this.profileTypeService.getProfileTypesForCustomer(
          customer.id,
        );
      const updatedProfileTypes =
        profileTypes.map((profileType) => ({
          ...profileType,
          name:
            nameMapping[profileType.name] ||
            profileType.name,
        }));

      const isHNI =
        await this.valuationService.isCustomerHNI(
          customer.id,
        );

      res.status(HttpStatus.OK).json({
        success: true,
        keywords,
        profileTypes: updatedProfileTypes,
        HNI: isHNI,
      });
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
      sessionId: string;
    },
    @Res() res: Response,
  ) {
    this.logger.log('Searching for Keywords');
    try {
      const decodedAuthorizationToken =
        this.authorizationService.decodeAuthorizationToken(
          request,
        );
      const agentSession =
        await this.validateAgentTokenService.validate(
          decodedAuthorizationToken,
        );

      // if (!agentSession) {
      //   throw new UnauthorizedException(
      //     'Invalid authorization token',
      //   );
      // }

      const contextType =
        this.contextService.identifyContext(
          searchDto.term,
        );

      if (contextType === 'date') {
        const dateSuggestions =
          this.contextService.generateDateSuggestions(
            searchDto.term,
          );
        res.status(HttpStatus.OK).json({
          success: true,
          results: dateSuggestions,
        });
        return;
      }

      const results =
        await this.searchService.autocomplete(
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
  async getQuestionsForCustomer(
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
    questionsDto: QuestionDto,
    @Res() res: Response,
  ) {
    this.logger.log('Questions API hit by agent');
    try {
      const decodedAuthorizationToken =
        this.authorizationService.decodeAuthorizationToken(
          request,
        );
      const agentSession =
        await this.validateAgentTokenService.validate(
          decodedAuthorizationToken,
        );

      // if (!agentSession) {
      //   throw new UnauthorizedException(
      //     'Invalid authorization token',
      //   );
      // }

      const crmHeader = request.headers['crm']?request.headers['crm']:"HC_CRM";
      const crmName = Array.isArray(crmHeader) ? crmHeader.join(', ') : crmHeader;

      const customer =
        await this.customerLookupService.findCustomerByCRMIdAndName(
          questionsDto.customerCRMId,
          crmName,
        );

      const remainingKeywords =
        await this.personaService.simulateKeywordProcessing(
          customer.id,
          questionsDto.currentKeywords || [],
        );

      questionsDto.currentKeywords =
        remainingKeywords;

      const questions =
        await this.agentQuestionService.getQuestionsForCustomer(
          customer,
          questionsDto.questionNumber,
          questionsDto.sessionId,
          questionsDto.serviceId,
          questionsDto.subServiceId,
          questionsDto.currentKeywords,
        );

      res
        .status(HttpStatus.OK)
        .json({ success: true, questions });
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
    this.logger.log('Agent has submitted');
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

      // if (!agentSession) {
      //   throw new UnauthorizedException(
      //     'Invalid authorization token',
      //   );
      // }

      const crmHeader = request.headers['crm']?request.headers['crm']:"HC_CRM";
      const crmName = Array.isArray(crmHeader) ? crmHeader.join(', ') : crmHeader;

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

      // const agentID =
      //   await this.submitService.getAgentIDFromSession(
      //     agentSession.id,
      //   );


      const agentIDHeader = request.headers['agentID']?request.headers['agentID']:"";
      const agentID = Array.isArray(agentIDHeader) ? agentIDHeader.join(', ') : agentIDHeader;

      const agentSubmitData = {
        CRM: agentSession.CRM,
        customerID: customer.id,
        agentID,
        remarks: submitDataDto.remarks || '',
        questions: [],
        keywords: [],
      };

      const [
        remainingKeywordIds,
        keywordsToAddToCreated,
      ] =
        await this.personaService.processPersonaKeywords(
          customer.id,
          selectedKeywords,
        );

      submitDataDto.selectedKeywords =
        remainingKeywordIds;
      submitDataDto.createdKeywords = [
        ...(submitDataDto.createdKeywords || []),
        ...keywordsToAddToCreated,
      ];
      submitDataDto.createdKeywords =
        await this.personaService.processCreatedKeywords(
          customer.id,
          createdKeywords,
        );

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

  @Post('/list-campaigns')
  async getCampaigns(
    @Req() request: Request,
    @Body() GetCampaignsDto: GetCampaignsDto,
    @Res() res: Response,
  ) {
    this.logger.log(
      'Campaign List fetched by agent',
    );
    try {
      const decodedToken =
        this.authorizationService.decodeAuthorizationToken(
          request,
        );
      const agentSession =
        await this.validateAgentTokenService.validate(
          decodedToken,
        );

      // if (!agentSession) {
      //   throw new UnauthorizedException(
      //     'Invalid authorization token',
      //   );
      // }

      const crmHeader = request.headers['crm']?request.headers['crm']:"HC_CRM";
      const crmName = Array.isArray(crmHeader) ? crmHeader.join(', ') : crmHeader;

      const customer =
        await this.customerLookupService.findCustomerByCRMIdAndName(
          GetCampaignsDto.customerCRMId,
          crmName,
        );

      const campaigns =
        await this.campaignService.getCampaignsForCustomer(
          customer.id,
          GetCampaignsDto.currentKeywords,
        );

      res
        .status(HttpStatus.OK)
        .json({ success: true, campaigns });
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @Post('/link-campaign')
  async createOrUpdateCampaign(
    @Req() request: Request,
    @Body() campaignDto: CampaignDto,
    @Res() res: Response,
  ) {
    this.logger.log(
      'Campaign message sent to customer',
    );
    try {
      const decodedToken =
        this.authorizationService.decodeAuthorizationToken(
          request,
        );
      const agentSession =
        await this.validateAgentTokenService.validate(
          decodedToken,
        );

      if (!agentSession) {
        throw new UnauthorizedException(
          'Invalid authorization token',
        );
      }

      const customer =
        await this.customerLookupService.findCustomerByCRMIdAndName(
          campaignDto.customerCRMId,
          agentSession.CRM,
        );

      const campaignResult =
        await this.campaignService.handleCampaign(
          customer.id,
          campaignDto,
        );

      res.status(HttpStatus.OK).json({
        success: true,
        ...campaignResult,
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

    this.logger.error(
      'Exception handled',
      error.stack,
    );
    res.status(200).json({
      success: false,
      status: statusCode,
      message: message,
    });
  }
}

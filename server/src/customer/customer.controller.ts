import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Response,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { CustomerService } from './customer.service';
import { Customer, Prisma } from '@prisma/client';
import { CreateCustomerHomecarePayload } from './types';
import { CustomerElasticService } from './customerElastic.service';
import {
  ColumnSearchDto,
  CompoundSearchDto,
  GlobalSearchDto,
} from './customer.dto';

// @UseGuards(JwtGuard)
@Controller('customers')
export class CustomerController {
  private readonly logger = new Logger(
    CustomerController.name,
  );
  constructor(
    private customerService: CustomerService,
    private customerElasticService: CustomerElasticService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  addCustomerDetails(@Body() dto: any) {
    return this.customerService.addCustomerDetails(
      dto,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  patchCustomerDetails(
    @Body() dto: any,
    @Param('id') customerId: string,
  ) {
    return this.customerService.patchCustomerDetails(
      customerId,
      dto,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('remarks/:id')
  async getCustomerRemarks(
    @Param('id') customerId: string,
  ) {
    return await this.customerService.fetchCustomerRemarks(
      customerId,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('paginated')
  getCustomerDetailsPaginated(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
  ) {
    this.logger.debug(
      'Pagination details',
      'page',
      page,
      'pageSize',
      pageSize,
    );
    const paginatedResponse =
      this.customerService.fetchCustomerDetailsPaginated(
        page,
        pageSize,
      );
    return paginatedResponse;
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getCustomerInfo(
    @Param('id') customerId: string,
  ) {
    console.log('customerId:', customerId);
    return this.customerService.fetchCustomerInfo(
      customerId,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  getCustomerDetails() {
    return this.customerService.fetchCustomerDetails();
  }

  @Post('search_customers_by_attr')
  async searchCustomers(
    @Body('information_type')
    informationType: string,
    @Body('category') category: string,
    @Body('value') value: string,
  ): Promise<Customer[]> {
    if (
      informationType === 'personal_information'
    ) {
      if (category === 'age') {
        return this.customerService.getCustomersByAgeRange(
          value,
        );
      } else if (category === 'gender') {
        return this.customerService.getCustomersByGender(
          value,
        );
      }
    } else if (informationType === 'interests') {
      return this.customerService.getCustomersByKeyword(
        value,
      );
    }

    return [];
  }

  @Get('/count/monthly/:source')
  getMonthlyCounts(
    @Param('source') source: string,
  ) {
    return this.customerService.countCustomersByMonth(
      source,
    );
  }

  @Post('/add/customer/generic')
  @HttpCode(HttpStatus.CREATED)
  async addCustomer(
    @Body('customerInput')
    customerInput: Prisma.CustomerCreateInput,
    @Body('personalDetailsInput')
    personalDetailsInput: Prisma.Personal_DetailsCreateInput,
  ) {
    try {
      const createdCustomer =
        await this.customerService.addCustomer_Homecare(
          customerInput,
          personalDetailsInput,
        );
      return {
        message: 'Customer created successfully',
        customer: createdCustomer,
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Failed to create customer',
        error,
      };
    }
  }

  @Post('/add/customer/hc')
  async addCustomerHM(
    @Body() data: CreateCustomerHomecarePayload,
  ) {
    try {
      const createdCustomer =
        await this.customerService.addCustomerHomecare(
          data,
        );
      console.log(
        'Homecare customer created',
        createdCustomer,
      );
      return {
        message: 'Customer created successfully',
        customer: createdCustomer,
        status: 201,
      };
    } catch (error) {
      console.error(error, 'ERROR');
      return {
        message: 'Failed to create customer',
        status: 500,
      };
    }
  }

  //Elastic Routes
  @Get('elastic/global-search')
  async globalSearch(
    @Query('searchTerm') searchTerm: string,
    @Query('from') from?: number,
    @Query('size') size?: number,
  ) {
    try {
      const { body } =
        await this.customerElasticService.globalSearch(
          'customertable',
          searchTerm,
          from,
          size,
        );
      return {
        hits: body.hits.hits.map(
          (hit) => hit._source,
        ),
        total: body.hits.total.value,
      };
    } catch (error) {
      this.logger.error(
        `Global search failed: ${error.message}`,
        error.stack,
      );
      return {
        error:
          'Failed to execute global search. Please try again later.',
      };
    }
  }

  @Get('elastic/column-search')
  async columnSearch(
    @Query('field') field: string,
    @Query('searchTerm') searchTerm: string,
    @Query('from') from?: number,
    @Query('size') size?: number,
  ) {
    try {
      const { body } =
        await this.customerElasticService.columnSearch(
          'customertable',
          field,
          searchTerm,
          from,
          size,
        );
      return body.hits.hits.map(
        (hit) => hit._source,
      );
    } catch (error) {
      this.logger.error(
        `Column search failed: ${error.message}`,
        error.stack,
      );
      return {
        error:
          'Failed to execute column search. Please try again later.',
      };
    }
  }

  @Get('elastic/compound-search')
  async compoundSearch(
    @Query()
    searchTerms: { [key: string]: string },
    @Query('from') from?: number,
    @Query('size') size?: number,
  ) {
    try {
      const {
        from: queryFrom,
        size: querySize,
        ...terms
      } = searchTerms;
      const filteredTerms = Object.entries(
        terms,
      ).reduce((acc, [key, value]) => {
        if (value !== '') acc[key] = value;
        return acc;
      }, {});

      const { body } =
        await this.customerElasticService.compoundSearch(
          'customertable',
          filteredTerms,
          Number(from),
          Number(size),
        );
      return body.hits.hits.map(
        (hit) => hit._source,
      );
    } catch (error) {
      this.logger.error(
        `Compound search failed: ${error.message}`,
        error.stack,
      );
      return {
        error:
          'Failed to execute compound search. Please try again later.',
      };
    }
  }

  @Get('elastic/fetch-paginated-results')
  async fetchPaginatedResults(
    @Query('from') from?: number,
    @Query('size') size?: number,
  ) {
    try {
      const { body } =
        await this.customerElasticService.fetchPaginatedResults(
          'customertable',
          from,
          size,
        );
      return {
        hits:
          body.hits.hits.length > 0
            ? body.hits.hits.map(
                (hit) => hit._source,
              )
            : [],
        total: body.hits.total.value,
      };
    } catch (error) {
      this.logger.error(
        `Fetching paginated results failed: ${error.message}`,
        error.stack,
      );
      return {
        error:
          'Failed to fetch paginated results. Please try again later.',
      };
    }
  }
}

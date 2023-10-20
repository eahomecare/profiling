import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Response,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { CustomerService } from './customer.service';
import { Customer, Prisma } from '@prisma/client';
import { CreateCustomerHomecarePayload } from './types';

// @UseGuards(JwtGuard)
@Controller('customers')
export class CustomerController {
  constructor(
    private customerService: CustomerService,
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

  @Get('/count/monthly')
  getMonthlyCounts() {
    return this.customerService.countCustomersByMonth();
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
}

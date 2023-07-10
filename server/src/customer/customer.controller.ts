import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Response, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { CustomerService } from './customer.service';

// @UseGuards(JwtGuard)
@Controller('api/customers')
export class CustomerController {

    constructor(private customerService: CustomerService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post()
    addCustomerDetails(@Body() dto: any) {
        return this.customerService.addCustomerDetails(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Patch(':id')
    patchCustomerDetails(
        @Body() dto: any,
        @Param('id') customerId: string
    ) {
        return this.customerService.patchCustomerDetails(customerId, dto)
    }

    @HttpCode(HttpStatus.OK)
    @Get(':id')
    getCustomerInfo(
        @Param('id') customerId: string
    ) {
        console.log('customerId:', customerId)
        return this.customerService.fetchCustomerInfo(customerId)

    }

    @HttpCode(HttpStatus.OK)
    @Get()
    getCustomerDetails() {
        return this.customerService.fetchCustomerDetails()
    }

}

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
import { Customer } from '@prisma/client';

// @UseGuards(JwtGuard)
@Controller('customers')
export class CustomerController {
    constructor(
        private customerService: CustomerService,
    ) { }

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

    @Post("search_customers_by_attr")
    async searchCustomers(
        @Body('information_type') informationType: string,
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

        } else if (informationType === "interest") {
            return this.customerService.getCustomersByKeyword(value)
        }

        return []
    }
}

import { CustomerService } from './customer.service';
export declare class CustomerController {
    private customerService;
    constructor(customerService: CustomerService);
    addCustomerDetails(dto: any): Promise<{
        status: string;
        message: string;
    }>;
    patchCustomerDetails(dto: any, customerId: string): Promise<string | {
        status: string;
        message: string;
    }>;
    getCustomerInfo(customerId: string): Promise<{
        customer_details: import(".prisma/client").Customer;
    }>;
    getCustomerDetails(): Promise<{
        customer_details: import(".prisma/client").Customer[];
    }>;
}

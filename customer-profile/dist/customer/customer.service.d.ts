import { PrismaService } from 'src/prisma/prisma.service';
export declare class CustomerService {
    private prisma;
    constructor(prisma: PrismaService);
    addCustomerDetails(customer_details: any): Promise<{
        status: string;
        message: string;
    }>;
    fetchCustomerDetails(): Promise<{
        customer_details: import(".prisma/client").Customer[];
    }>;
    fetchCustomerInfo(customerId: string): Promise<{
        customer_details: import(".prisma/client").Customer;
    }>;
    patchCustomerDetails(customerId: string, customer_details: any): Promise<string | {
        status: string;
        message: string;
    }>;
}

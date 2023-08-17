import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CustomerLookupService {
    constructor(private readonly prisma: PrismaService) { }

    async findCustomerByCRMIdAndName(customerCRMId: string, crmName: string) {
        const customerMapping = await this.prisma.customerCRMMapping.findUnique({
            where: {
                customerCrmId_crmName: {
                    customerCrmId: customerCRMId,
                    crmName: crmName
                }
            }
        });

        if (!customerMapping) {
            throw new NotFoundException(`No mapping found for CRM ID ${customerCRMId} and CRM Name ${crmName}`);
        }

        const customer = await this.prisma.customer.findUnique({
            where: {
                id: customerMapping.customerId
            }
        });

        if (!customer) {
            throw new NotFoundException(`No customer found for ID ${customerMapping.customerId}`);
        }

        return customer;
    }
}
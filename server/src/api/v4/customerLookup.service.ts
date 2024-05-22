import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CustomerLookupService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findCustomerByCRMIdAndName(
    customerCRMId: string | number,
    crmName: string,
  ) {
    let customer = null;

    if (crmName === 'HC') {
      const customerMapping =
        await this.prisma.customerHomecareMapping.findFirst(
          {
            where: {
              wp_user_id:
                typeof customerCRMId === 'string'
                  ? parseInt(customerCRMId, 10)
                  : customerCRMId,
            },
          },
        );

      if (!customerMapping) {
        throw new NotFoundException(
          `No mapping found for CRM ID ${customerCRMId} and CRM Name ${crmName}`,
        );
      }

      customer =
        await this.prisma.customer.findUnique({
          where: {
            id: customerMapping.master_customer_id,
          },
        });
    } else if(crmName === 'HC_CRM'){
      const customerMapping =
        await this.prisma.customerHomecareMappingCrm.findFirst(
          {
            where: {
              wp_user_id:
                typeof customerCRMId === 'string'
                  ? parseInt(customerCRMId, 10)
                  : customerCRMId,
            },
          },
        );

        console.log(customerMapping);

      if (!customerMapping) {
        throw new NotFoundException(
          `No mapping found for CRM ID ${customerCRMId} and CRM Name ${crmName}`,
        );
      }

      customer =
        await this.prisma.customer.findUnique({
          where: {
            id: customerMapping.master_customer_id,
          },
        });

        console.log(customer);
    } else {
      // This part is for other CRM names which will be handled later
      const customerMapping =
        await this.prisma.customerCRMMapping.findUnique(
          {
            where: {
              customerCrmId_crmName: {
                customerCrmId:
                  customerCRMId.toString(),
                crmName: crmName,
              },
            },
          },
        );

      if (!customerMapping) {
        throw new NotFoundException(
          `No mapping found for CRM ID ${customerCRMId} and CRM Name ${crmName}`,
        );
      }

      customer =
        await this.prisma.customer.findUnique({
          where: {
            id: customerMapping.customerId,
          },
        });
    }

    if (!customer) {
      throw new NotFoundException(
        `No customer found for ID ${customerCRMId}`,
      );
    }

    return customer;
  }
}

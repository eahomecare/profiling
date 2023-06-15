import { Controller, Post, Body ,Get,Param} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('api')
export class ServiceCustomerController {
  @Post('sync-customer-history')
  async createCustomers(@Body() payloads: any[]) {
    try {
      const serviceMappings = [];

      for (const payload of payloads) {
        const existingCustomer = await prisma.customer.findUnique({
          where: { mobile: payload.mobile_no.toString() },
        });

        let newCustomer;

        if (existingCustomer) {
          await prisma.customer.update({
            where: { id: existingCustomer.id },
            data: {
              email: payload.email_id,
              personal_details: {
                update: {
                  full_name: payload.customer_name,
                  phone_number: payload.mobile_no.toString(),
                  email_address: payload.email_id,
                },
              },
            },
          });
        } else {
          newCustomer = await prisma.customer.create({
            data: {
              mobile: payload.mobile_no.toString(),
              email: payload.email_id,
              source: payload.source_of_booking,
              personal_details: {
                create: {
                  full_name: payload.customer_name,
                  phone_number: payload.mobile_no.toString(),
                  email_address: payload.email_id,
                },
              },
            },
            include: { personal_details: true },
          });
        }

        const existingService = await prisma.service.findFirst({
          where: { name: payload.plan_name },
        });

        let newService;

        if (existingService) {
          await prisma.service.update({
            where: { id: existingService.id },
            data: {
              subType: payload.service_sub_type,
            },
          });
        } else {
          newService = await prisma.service.create({
            data: {
              name: payload.plan_name,
              subType: payload.service_sub_type,
            },
          });
        }

        const existingServiceMapping = await prisma.serviceCustomerUsageMapping.findFirst({
          where: { ticket_id: payload.ticket_id },
        });

        if (!existingServiceMapping) {
          const serviceMappingCreated = await prisma.serviceCustomerUsageMapping.create({
            data: {
              serviceId: existingService ? existingService.id : newService.id,
              customerId: existingCustomer ? existingCustomer.id : newCustomer.id,
              ticket_id: payload.ticket_id,
              order_id: payload.order_id,
              source_of_booking: payload.source_of_booking,
              ticket_type: payload.ticket_type,
              ticket_date: payload.ticket_date,
              action: payload.action,
              action_date_time: payload.action_date_time,
              tat: payload.tat,
            },
          });

          serviceMappings.push(serviceMappingCreated);
        }
      }

      return { message: 'Customers and service usage mappings created successfully.', data: serviceMappings };
    } catch (error) {
      console.error(error);

      return { error: 'An error occurred while creating customers and service usage mappings.' };
    }
  }

  @Get('service-customer-mappings/:customerId')
  async getServiceCustomerMappings(
    @Param('customerId') customerId: string,
  ) {
    try {
      const mappings = await prisma.serviceCustomerUsageMapping.findMany({
        where: { customerId },
        include: { service: true },
      });

      return {
        message: 'Service-customer mappings retrieved successfully.',
        data: mappings,
      };
    } catch (error) {
      console.error(error);

      return {
        error: 'An error occurred while retrieving service-customer mappings.',
      };
    }
  }
}

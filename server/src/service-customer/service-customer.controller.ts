import { Controller, Post, Body } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('service-customer')
export class ServiceCustomerController {
  // API endpoint to create or update service and customer
  @Post()
  async createOrUpdateServiceAndCustomer(@Body() payload: any) {
    try {
      const { mobile_no, customer_name, email_id, plan_name, service_type, service_sub_type } = payload;

      // Check if customer with the same mobile number already exists
      const existingCustomer = await prisma.customer.findFirst({
        where: {
          mobile: mobile_no,
        },
      });

      let customerId: string;

      if (existingCustomer) {
        // Update existing customer with new details
        const updatedCustomer = await prisma.customer.update({
          where: {
            id: existingCustomer.id,
          },
          data: {
            customer_name,
            email: email_id,
          },
        });

        customerId = updatedCustomer.id;
      } else {
        // Create a new customer
        const newCustomer = await prisma.customer.create({
          data: {
            customer_name,
            mobile: mobile_no,
            email: email_id,
          },
        });

        customerId = newCustomer.id;
      }

      // Check if service with the same plan name already exists
      const existingService = await prisma.service.findFirst({
        where: {
          name: plan_name,
        },
      });

      let serviceId: string;

      if (existingService) {
        serviceId = existingService.id;
      } else {
        // Create a new service
        const newService = await prisma.service.create({
          data: {
            name: plan_name,
            subType: service_sub_type,
            profileTypeIDs: [],
            description: '',
          },
        });

        serviceId = newService.id;
      }

      // Create service_customer_usage_mapping
      await prisma.serviceCustomerUsageMapping.create({
        data: {
          serviceId,
          customerId,
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

      return { message: 'Service and customer created/updated successfully' };
    } catch (error) {
      throw new Error('Error creating/updating service and customer');
    }
  }
}

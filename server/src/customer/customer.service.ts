import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { findInClassification } from '../classifications/find.service';
import { PrismaService } from '../prisma/prisma.service';
import { merge } from 'lodash';
import { Customer } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) { }

  async addCustomerDetails(
    customer_details: any,
  ) {
    try {
      if (customer_details.keys) {
        const keys = customer_details.keys;
        let profiling = customer_details.profiling
          ? customer_details.profiling
          : {};
        profiling.garbage = [];
        keys.forEach((key) => {
          const keyFound =
            findInClassification(key);
          console.log(
            `Match found - ${keyFound} - ${key}`,
          );
          if (!keyFound) {
            profiling.garbage.push(key);
          } else if (
            typeof keyFound != 'boolean'
          ) {
            // profiling = Object.assign({}, profiling, {
            //     [keyFound]: { [key]: true }
            // })
            profiling = merge(profiling, {
              [keyFound]: { [key]: true },
            });
          }
        });
        customer_details.profiling = profiling;
      }
      // console.log('customer_details', customer_details)
      const customer_id =
        await this.prisma.customer.create({
          data: customer_details,
          select: { id: true },
        });
      // .then(console.log)
      // .catch(console.log)
      if (
        customer_details.profiling
          .personal_details
      ) {
        console.log(
          customer_details.profiling
            .personal_details,
        );
        await this.prisma.personal_Details.create(
          {
            data: Object.assign(
              {
                customer: {
                  connect: customer_id,
                },
              },
              customer_details.profiling
                .personal_details,
            ),
          },
        );
      }
      return {
        status: 'Success',
        message:
          'Customer Details stored successfully',
      };
    } catch (error) {
      console.log('Errororor', error);
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Customer exists with same mobile number',
          );
        }
        return {
          status: 'failed',
          message:
            'Customer with same mobiile number',
        };
      } else {
        return {
          status: 'Failure',
          message:
            'Duplicate Customer or Invalid Keys',
        };
      }
    }
  }

  // async fetchCustomerDetails() {
  //   const customerDetails = {
  //     customer_details:
  //       await this.prisma.customer.findMany({include:{personal_details:true}}),
  //   };
  //   return customerDetails;
  // }

  async fetchCustomerDetails() {
    const customerDetails =
      await this.prisma.customer.findMany({
        include: {
          personal_details: true,
        },
      });

    const formattedCustomerDetails =
      customerDetails.map((customer) => {
        const { personal_details, ...rest } =
          customer;
        return {
          ...rest,
          profiling: {
            personal_details,
          },
        };
      });

    return {
      customer_details: formattedCustomerDetails,
    };
  }

  async fetchCustomerInfo(customerId: string) {
    const customerDetails = {
      customer_details:
        await this.prisma.customer.findUnique({
          where: { id: customerId },
          include: { personal_details: true },
        }),
    };
    return customerDetails;
  }

  async patchCustomerDetails(
    customerId: string,
    customer_details: any,
  ) {
    try {
      if (customer_details.keys) {
        const keys = customer_details.keys;
        let profiling = Object.create({});
        if (
          customer_details.profiling
            .personal_details
        )
          profiling.personal_details =
            customer_details.profiling.personal_details;
        // let profiling = customer_details.profiling ? customer_details.profiling : {}
        profiling.garbage = [];
        keys.forEach((key) => {
          const keyFound =
            findInClassification(key);
          console.log(
            `Match found - ${keyFound} - ${key}`,
          );
          if (!keyFound) {
            profiling.garbage.push(key);
          } else if (
            typeof keyFound != 'boolean'
          ) {
            // profiling = Object.assign({}, profiling, {
            //     [keyFound]: { [key]: true }
            // })
            profiling = merge(profiling, {
              [keyFound]: { [key]: true },
            });
          }
        });
        customer_details.profiling = profiling;
        // delete customer_details.keys
        delete customer_details.id;
      }
      customer_details.updated_at = new Date();
      // console.log('customer_details', customer_details)
      const updatedCustomer =
        await this.prisma.customer
          .update({
            where: { id: customerId },
            data: customer_details,
          })
          .then(console.log)
          .catch(console.log);
      // if (customer_details.profiling.personal_details) {
      //     await this.prisma.personal_Details
      //         .update({
      //             where: { id: customerId },
      //             data: customer_details.profiling.personal_details
      //         })
      // }
      // return { status: 'Success', message: 'Customer Details updated successfully' }
      return JSON.stringify(updatedCustomer);
    } catch (error) {
      console.log('Errororor', error);
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Customer exists with same mobile number',
          );
        }
        return {
          status: 'failed',
          message:
            'Customer with same mobiile number',
        };
      } else {
        return {
          status: 'Failure',
          message:
            'Duplicate Customer or Invalid Keys',
        };
      }
    }
  }

  async updateKeywords(
    customerId: string,
    keywordIds: string[],
  ): Promise<Customer> {
    try {
      const customer =
        await this.prisma.customer.update({
          where: { id: customerId },
          data: {
            keywordIDs: { set: keywordIds },
          },
          include: { keywords: true },
        });
      return customer;
    } catch (error) {
      throw new Error(
        `Could not update keywords for customer with id ${customerId}: ${error.message}`,
      );
    }
  }

  async getCustomersByAgeRange(ageRange: string) {
    try {
      const currentDate = new Date();
      const minAge = parseInt(ageRange.split('-')[0]);
      const maxAge = parseInt(ageRange.split('-')[1]);

      const minDOB = new Date(
        currentDate.getFullYear() - maxAge,
        currentDate.getMonth(),
        currentDate.getDate(),
      );
      const maxDOB = new Date(
        currentDate.getFullYear() - minAge,
        currentDate.getMonth(),
        currentDate.getDate(),
      );

      const formatDate = (date: Date) => {
        return date.toISOString(); // Convert Date to "YYYY-MM-DDTHH:mm:ss.sssZ" format
      };

      const customers = await this.prisma.customer.findMany({
        where: {
          personal_details: {
            date_of_birth: {
              gte: formatDate(minDOB),
              lte: formatDate(maxDOB),
            },
          },
        },
      });

      return customers;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }


  async getCustomersByGender(gender: string) {
    try {
      const customers = await this.prisma.customer.findMany({
        where: {
          personal_details: {
            gender: {
              equals: gender,
            },
          },
        },
        include: { personal_details: true }
      });

      return customers;
    } catch (error) {
      console.error('Error fetching customers by gender:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }


  async getCustomersByKeyword(keywordCategoryId: string) {
    try {
      console.log(keywordCategoryId);

      const customers = await this.prisma.customer.findMany({
        where: {
          keywords: {
            some: {
              id: keywordCategoryId,
            },
          },
        },
      });

      return customers;
    } catch (error) {
      console.error('Error fetching customers by keyword category:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

}


import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { findInClassification } from '../classifications/find.service';
import { PrismaService } from '../prisma/prisma.service';
import { merge, groupBy } from 'lodash';
import {
  Customer,
  Prisma,
  Personal_Details,
} from '@prisma/client';
import { tryCatch } from 'bullmq';
import { CreateCustomerHomecarePayload } from './types';
import { log } from 'console';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async countCustomersByMonth() {
    const customers =
      await this.prisma.customer.findMany({
        select: {
          created_at: true,
        },
      });

    const monthNames = {
      '01': 'January',
      '02': 'February',
      '03': 'March',
      '04': 'April',
      '05': 'May',
      '06': 'June',
      '07': 'July',
      '08': 'August',
      '09': 'September',
      '10': 'October',
      '11': 'November',
      '12': 'December',
    };

    const customersGroupedByMonth = groupBy(
      customers,
      (customer: any) =>
        monthNames[
          customer.created_at
            .toISOString()
            .slice(5, 7)
        ] +
        ' ' +
        customer.created_at
          .toISOString()
          .slice(0, 4),
    );

    const customerCountsByMonth = Object.entries(
      customersGroupedByMonth,
    ).map(([month, customers]: any) => ({
      month,
      count: customers.length,
    }));

    return customerCountsByMonth;
  }

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
      const minAge = parseInt(
        ageRange.split('-')[0],
      );
      const maxAge = parseInt(
        ageRange.split('-')[1],
      );

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

      const customers =
        await this.prisma.customer.findMany({
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
      console.error(
        'Error fetching customers:',
        error,
      );
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async getCustomersByGender(gender: string) {
    try {
      const customers =
        await this.prisma.customer.findMany({
          where: {
            personal_details: {
              gender: {
                equals: gender,
              },
            },
          },
          include: { personal_details: true },
        });

      return customers;
    } catch (error) {
      console.error(
        'Error fetching customers by gender:',
        error,
      );
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async getCustomersByKeyword(
    keywordCategoryId: string,
  ) {
    try {
      console.log(keywordCategoryId);

      const customers =
        await this.prisma.customer.findMany({
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
      console.error(
        'Error fetching customers by keyword category:',
        error,
      );
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async addCustomer_Homecare(
    customerInput: Prisma.CustomerCreateInput,
    personalDetailsInput: Prisma.Personal_DetailsCreateInput,
  ) {
    try {
      const dateOfBirth =
        personalDetailsInput.date_of_birth
          ? new Date(
              personalDetailsInput.date_of_birth,
            )
          : null;

      const customer =
        await this.prisma.customer.create({
          data: {
            mobile: customerInput.mobile,
            email: customerInput.email,
            source: customerInput.source,
          },
        });

      await this.prisma.personal_Details.create({
        data: {
          customer_id: customer.id,
          full_name:
            personalDetailsInput.full_name,
          phone_number: customerInput.mobile,
          email_address: customerInput.email,
          date_of_birth: dateOfBirth,
          gender: personalDetailsInput.gender,
          address: personalDetailsInput.address,
          employment:
            personalDetailsInput.employment,
          location: personalDetailsInput.location,
        },
      });

      const createdCustomer =
        await this.prisma.customer.findUnique({
          where: {
            id: customer.id,
          },
        });

      return createdCustomer;
    } catch (error) {
      return error;
    }
  }

  async addCustomerHomecare(
    payload: CreateCustomerHomecarePayload,
  ) {
    try {
      let {
        personalDetails,
        socketId,
        cyberior_customer_id,
        homecare_post_id,
        cyberior_activation_status,
        cyberior_id,
        cyberior_user_id,
        cyberior_activation_date,
        registrationVerificationStatus,
        wp_user_id,
        customer_id,
        createdAt,
        updatedAt,
      } = payload;

      console.log(payload, 'payload');

      createdAt = new Date(createdAt);
      updatedAt = new Date(updatedAt);

      // Create CustomerHomecare
      const customerHomecare =
        await this.prisma.customerHomecare.create(
          {
            data: {
              socketId,
              cyberior_customer_id,
              homecare_post_id,
              cyberior_activation_status,
              cyberior_id,
              cyberior_user_id,
              cyberior_activation_date,
              registrationVerificationStatus,
              wp_user_id,
              customer_id,
              createdAt,
              updatedAt,
            },
          },
        );

      const personalDetailsHomecare =
        await this.prisma.personalDetailsHomecare.create(
          {
            data: {
              ccode: personalDetails.ccode,
              country: personalDetails.country,
              fname: personalDetails.fname,
              lname: personalDetails.lname,
              gender: personalDetails.gender,
              location: personalDetails.location,
              email: personalDetails.email,
              mobile: personalDetails.mobile,
              memberBenefitId:
                personalDetails.memberBenefitId,
              planId: personalDetails.planId,
              clientId: personalDetails.clientId,
              programId:
                personalDetails.programId,
              regCode: personalDetails.regCode,
              customer: {
                connect: {
                  id: customerHomecare.id,
                },
              },
            },
          },
        );

      const customerMaster =
        await this.prisma.customer.create({
          data: {
            mobile: personalDetails.mobile,
            email: personalDetails.email,
            source: 'homecare',
          },
        });

      await this.prisma.personal_Details.create({
        data: {
          customer_id: customerMaster.id,
          full_name: `${personalDetails.fname} ${personalDetails.lname}`,
          phone_number: personalDetails.mobile,
          email_address: personalDetails.email,
          gender: personalDetails.gender,
          location: personalDetails.location,
        },
      });

      const customerHomecareMapping =
        await this.prisma.customerHomecareMapping.create(
          {
            data: {
              master_customer_id:
                customerMaster.id,
              wp_user_id,
              homecare_customer_id:
                customerHomecare.id,
            },
          },
        );

      return customerHomecareMapping;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

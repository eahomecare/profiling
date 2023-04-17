import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { findInClassification } from 'src/classifications/find.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { merge } from 'lodash'

@Injectable()
export class CustomerService {
    constructor(private prisma: PrismaService) { }

    async addCustomerDetails(customer_details: any) {
        try {
            if (customer_details.keys) {
                const keys = customer_details.keys
                let profiling = customer_details.profiling ? customer_details.profiling : {}
                profiling.garbage = []
                keys.forEach(key => {
                    const keyFound = findInClassification(key)
                    console.log(`Match found - ${keyFound} - ${key}`)
                    if (!keyFound) {
                        profiling.garbage.push(key)
                    } else
                        if (typeof keyFound != 'boolean') {
                            // profiling = Object.assign({}, profiling, {
                            //     [keyFound]: { [key]: true }
                            // })
                            profiling = merge(profiling, {
                                [keyFound]: { [key]: true }
                            })
                        }
                });
                customer_details.profiling = profiling
            }
            // console.log('customer_details', customer_details)
            const customer_id = await this.prisma.customer.create({ data: customer_details, select: { id: true } })
            // .then(console.log)
            // .catch(console.log)
            if (customer_details.profiling.personal_details) {
                console.log(
                    customer_details.profiling.personal_details
                )
                await this.prisma.personal_Details.create({ data: Object.assign({ customer: { connect: customer_id } }, customer_details.profiling.personal_details) })
            }
            return { status: 'Success', message: 'Customer Details stored successfully' }
        }
        catch (error) {
            console.log('Errororor', error)
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
                    message: 'Customer with same mobiile number'
                }
            }
            else {
                return { status: 'Failure', message: 'Duplicate Customer or Invalid Keys' }
            }
        }
    }


    async fetchCustomerDetails() {
        const customerDetails = {
            customer_details: await this.prisma.customer.findMany(),
            // personal_details: await this.prisma.personal_Details.findMany(),
        }
        return customerDetails
    }

    async fetchCustomerInfo(customerId: string) {
        const customerDetails = {
            customer_details: await this.prisma.customer
                .findUnique({ where: { id: customerId } }),
        }
        return customerDetails
    }

    async patchCustomerDetails(customerId: string, customer_details: any) {
        try {
            if (customer_details.keys) {
                const keys = customer_details.keys
                let profiling = Object.create({})
                if (customer_details.profiling.personal_details)
                    profiling.personal_details = customer_details.profiling.personal_details
                // let profiling = customer_details.profiling ? customer_details.profiling : {}
                profiling.garbage = []
                keys.forEach(key => {
                    const keyFound = findInClassification(key)
                    console.log(`Match found - ${keyFound} - ${key}`)
                    if (!keyFound) {
                        profiling.garbage.push(key)
                    } else
                        if (typeof keyFound != 'boolean') {
                            // profiling = Object.assign({}, profiling, {
                            //     [keyFound]: { [key]: true }
                            // })
                            profiling = merge(profiling, {
                                [keyFound]: { [key]: true }
                            })
                        }
                });
                customer_details.profiling = profiling
                // delete customer_details.keys
                delete customer_details.id
            }
            customer_details.updated_at = new Date()
            // console.log('customer_details', customer_details)
            const updatedCustomer = await this.prisma.customer
                .update({
                    where: { id: customerId },
                    data: customer_details
                })
                .then(console.log)
                .catch(console.log)
            // if (customer_details.profiling.personal_details) {
            //     await this.prisma.personal_Details
            //         .update({
            //             where: { id: customerId },
            //             data: customer_details.profiling.personal_details
            //         })
            // }
            // return { status: 'Success', message: 'Customer Details updated successfully' }
            return JSON.stringify(updatedCustomer)
        }
        catch (error) {
            console.log('Errororor', error)
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
                    message: 'Customer with same mobiile number'
                }
            }
            else {
                return { status: 'Failure', message: 'Duplicate Customer or Invalid Keys' }
            }
        }
    }
}

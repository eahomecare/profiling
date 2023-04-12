"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const runtime_1 = require("@prisma/client/runtime");
const find_service_1 = require("../classifications/find.service");
const prisma_service_1 = require("../prisma/prisma.service");
const lodash_1 = require("lodash");
let CustomerService = class CustomerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addCustomerDetails(customer_details) {
        try {
            if (customer_details.keys) {
                const keys = customer_details.keys;
                let profiling = customer_details.profiling ? customer_details.profiling : {};
                profiling.garbage = [];
                keys.forEach(key => {
                    const keyFound = (0, find_service_1.findInClassification)(key);
                    console.log(`Match found - ${keyFound} - ${key}`);
                    if (!keyFound) {
                        profiling.garbage.push(key);
                    }
                    else if (typeof keyFound != 'boolean') {
                        profiling = (0, lodash_1.merge)(profiling, {
                            [keyFound]: { [key]: true }
                        });
                    }
                });
                customer_details.profiling = profiling;
            }
            const customer_id = await this.prisma.customer.create({ data: customer_details, select: { id: true } });
            if (customer_details.profiling.personal_details) {
                console.log(customer_details.profiling.personal_details);
                await this.prisma.personal_Details.create({ data: Object.assign({ customer: { connect: customer_id } }, customer_details.profiling.personal_details) });
            }
            return { status: 'Success', message: 'Customer Details stored successfully' };
        }
        catch (error) {
            console.log('Errororor', error);
            if (error instanceof
                runtime_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ForbiddenException('Customer exists with same mobile number');
                }
                return {
                    status: 'failed',
                    message: 'Customer with same mobiile number'
                };
            }
            else {
                return { status: 'Failure', message: 'Duplicate Customer or Invalid Keys' };
            }
        }
    }
    async fetchCustomerDetails() {
        const customerDetails = {
            customer_details: await this.prisma.customer.findMany(),
        };
        return customerDetails;
    }
    async fetchCustomerInfo(customerId) {
        const customerDetails = {
            customer_details: await this.prisma.customer
                .findUnique({ where: { id: customerId } }),
        };
        return customerDetails;
    }
    async patchCustomerDetails(customerId, customer_details) {
        try {
            if (customer_details.keys) {
                const keys = customer_details.keys;
                let profiling = Object.create({});
                if (customer_details.profiling.personal_details)
                    profiling.personal_details = customer_details.profiling.personal_details;
                profiling.garbage = [];
                keys.forEach(key => {
                    const keyFound = (0, find_service_1.findInClassification)(key);
                    console.log(`Match found - ${keyFound} - ${key}`);
                    if (!keyFound) {
                        profiling.garbage.push(key);
                    }
                    else if (typeof keyFound != 'boolean') {
                        profiling = (0, lodash_1.merge)(profiling, {
                            [keyFound]: { [key]: true }
                        });
                    }
                });
                customer_details.profiling = profiling;
                delete customer_details.id;
            }
            customer_details.updated_at = new Date();
            const updatedCustomer = await this.prisma.customer
                .update({
                where: { id: customerId },
                data: customer_details
            })
                .then(console.log)
                .catch(console.log);
            return JSON.stringify(updatedCustomer);
        }
        catch (error) {
            console.log('Errororor', error);
            if (error instanceof
                runtime_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ForbiddenException('Customer exists with same mobile number');
                }
                return {
                    status: 'failed',
                    message: 'Customer with same mobiile number'
                };
            }
            else {
                return { status: 'Failure', message: 'Duplicate Customer or Invalid Keys' };
            }
        }
    }
};
CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomerService);
exports.CustomerService = CustomerService;
//# sourceMappingURL=customer.service.js.map
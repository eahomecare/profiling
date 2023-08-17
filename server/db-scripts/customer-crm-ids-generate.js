const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function createCustomerCRMMapping() {
    try {
        const customers = await prisma.customer.findMany();

        for (const customer of customers) {
            const existingMapping = await prisma.customerCRMMapping.findFirst({
                where: {
                    customerId: customer.id,
                    crmName: 'HC'
                }
            });

            if (!existingMapping) {
                // Create a predictable hash of the customer's mobile number
                const hash = crypto.createHash('sha256');
                const customerCrmId = hash.update(customer.mobile).digest('hex');

                // Create new CustomerCRMMapping
                await prisma.customerCRMMapping.create({
                    data: {
                        customerCrmId: customerCrmId,
                        crmName: 'HC',
                        customerId: customer.id
                    }
                });
            }
        }

        console.log('CustomerCRMMapping updated successfully.');
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createCustomerCRMMapping();
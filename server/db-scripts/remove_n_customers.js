const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function removeLastNCustomers(n) {
    // Get the last n added customers
    const lastNCustomers = await prisma.customer.findMany({
        take: n,
        orderBy: {
            created_at: 'desc',
        },
    });

    for (const customer of lastNCustomers) {
        const customerId = customer.id;

        await prisma.occupationCustomerMapping.deleteMany({
            where: {
                customerId,
            },
        });

        await prisma.vehicleCustomerMapping.deleteMany({
            where: {
                customerId,
            },
        });

        await prisma.profileTypeCustomerMapping.deleteMany({
            where: {
                customerId,
            },
        });

        await prisma.serviceCustomerUsageMapping.deleteMany({
            where: {
                customerId,
            },
        });

        await prisma.personal_Details.deleteMany({
            where: {
                customer_id: customerId,
            },
        });

        // Get keywords associated with the customer
        const customersKeywords = await prisma.keyword.findMany({
            where: {
                customers: {
                    some: {
                        id: customerId,
                    },
                },
            },
        });

        // Disconnect the customer from keywords
        for (const keyword of customersKeywords) {
            await prisma.keyword.update({
                where: {
                    id: keyword.id,
                },
                data: {
                    customers: {
                        disconnect: {
                            id: customerId,
                        },
                    },
                },
            });
        }

        const customerAgentSubmits = await prisma.agentSubmits.findMany({
            where: {
                customerID: customerId
            },
        });

        for (const agentSubmit of customerAgentSubmits) {
            const agentSubmitKeywordsMapping = await prisma.agentSubmitKeywordsMapping.findMany({
                where: {
                    agentSubmitId: agentSubmit.id,
                    keywordId: {
                        not: undefined,
                    },
                },
            });

            for (const mapping of agentSubmitKeywordsMapping) {
                await prisma.agentSubmitKeywordsMapping.delete({
                    where: { id: mapping.id },
                });
            }

            await prisma.agentSubmits.delete({
                where: { id: agentSubmit.id },
            });
        }



        await prisma.customer.delete({
            where: {
                id: customerId,
            },
        });
    }
}

async function main() {
    const n = 5;
    await removeLastNCustomers(n);
    console.log(`Successfully removed the last ${n} customers and cleaned related data.`);
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

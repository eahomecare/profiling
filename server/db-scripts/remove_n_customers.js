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

        await prisma.keyword.updateMany({
            where: {
                customers: {
                    some: {
                        id: customerId,
                    },
                },
            },
            data: {
                customers: {
                    disconnect: {
                        id: customerId,
                    },
                },
            },
        });


        await prisma.question.updateMany({
            where: {
                customers: {
                    some: {
                        id: customerId,
                    },
                },
            },
            data: {
                customers: {
                    disconnect: {
                        id: customerId,
                    },
                },
            },
        });

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

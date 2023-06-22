const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createProfileTypeCustomerMappings() {
  const customers = await prisma.customer.findMany();
  const profileTypes = await prisma.profileType.findMany();


  for (const customer of customers) {
    for (const profileType of profileTypes) {
      await prisma.profileTypeCustomerMapping.create({
        data: {
          profileTypeId:profileType.id,
          customerId:customer.id,
          level: 1,
        },
      });

      console.log(`ProfileTypeCustomerMapping created for user ${customer.id} and profile type ${profileType.id}`);
    }
  }
}

createProfileTypeCustomerMappings()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const {
  PrismaClient,
} = require('@prisma/client');
const prisma = new PrismaClient();

async function createProfileTypeCustomerMappings() {
  const customers =
    await prisma.customer.findMany();
  const profileTypes =
    await prisma.profileType.findMany();

  const parallelCustomers = 1000;

  const customerChunks = [];
  for (
    let i = 0;
    i < customers.length;
    i += parallelCustomers
  ) {
    customerChunks.push(
      customers.slice(i, i + parallelCustomers),
    );
  }

  await Promise.all(
    customerChunks.map(async (chunk) => {
      for (const profileType of profileTypes) {
        for (const customer of chunk) {
          await prisma.profileTypeCustomerMapping.create(
            {
              data: {
                profileTypeId: profileType.id,
                customerId: customer.id,
                level: 1,
              },
            },
          );

          console.log(
            `ProfileTypeCustomerMapping created for customer ${customer.id} and profile type ${profileType.id}`,
          );
        }
      }
    }),
  );
}

createProfileTypeCustomerMappings()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

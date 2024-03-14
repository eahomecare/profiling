const {
  PrismaClient,
} = require('@prisma/client');
const prisma = new PrismaClient();

async function updateCustomerMappings() {
  try {
    let totalUpdatedCustomers = 0;
    const batchSize = 1000;

    const totalCustomers =
      await prisma.customer.count();
    const batches = Math.ceil(
      totalCustomers / batchSize,
    );

    console.log(
      `Starting updates in ${batches} batches.`,
    );

    for (let i = 0; i < batches; i++) {
      const customers =
        await prisma.customer.findMany({
          skip: i * batchSize,
          take: batchSize,
          include: {
            personal_details: true,
            ProfileTypeCustomerMapping: true,
          },
        });

      for (const customer of customers) {
        // Randomly update levels for ProfileTypeCustomerMapping
        for (const mapping of customer.ProfileTypeCustomerMapping) {
          const randomLevel =
            Math.random() < 0.5
              ? mapping.level
              : 2; // 50% chance to change to 2
          await prisma.profileTypeCustomerMapping.update(
            {
              where: { id: mapping.id },
              data: { level: randomLevel },
            },
          );
        }

        // Update date_of_birth in Personal_Details
        if (customer.personal_details) {
          const randomDateOfBirth =
            generateRandomDateOfBirth();
          await prisma.personal_Details.update({
            where: {
              id: customer.personal_details.id,
            },
            data: {
              date_of_birth: randomDateOfBirth,
            },
          });
        }

        totalUpdatedCustomers += 1;
      }

      console.log(
        `Batch ${i + 1} of ${batches} processed.`,
      );
    }

    console.log(
      `Total updated customers: ${totalUpdatedCustomers}`,
    );
  } catch (error) {
    console.error(
      'Error updating customer mappings:',
      error,
    );
  } finally {
    await prisma.$disconnect();
  }
}

function generateRandomDateOfBirth() {
  const currentYear = new Date().getFullYear();
  const year =
    Math.floor(
      Math.random() * (currentYear - 1930 - 10),
    ) + 1930;
  const month =
    Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month - 1, day);
}

updateCustomerMappings();

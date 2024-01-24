const {
  PrismaClient,
} = require('@prisma/client');
const prisma = new PrismaClient();

async function enableAllProfileTypes() {
  try {
    const profileTypeMappings =
      await prisma.profileTypeCustomerMapping.findMany();

    for (const mapping of profileTypeMappings) {
      await prisma.profileTypeCustomerMapping.update(
        {
          where: { id: mapping.id },
          data: { isEnabled: true },
        },
      );
    }

    console.log(
      'All profile type customer mappings have been enabled.',
    );
  } catch (error) {
    console.error(
      'Error updating profile type customer mappings:',
      error,
    );
  }
}

async function main() {
  await enableAllProfileTypes();
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const {
  PrismaClient,
} = require('@prisma/client');
const prisma = new PrismaClient();

function getRandomSubset(array, size) {
  const shuffled = array.sort(
    () => 0.5 - Math.random(),
  );
  return shuffled.slice(0, size);
}

async function assignRandomKeywordsToCustomers() {
  const customers =
    await prisma.customer.findMany({
      take: 50,
    });

  const keywords =
    await prisma.keyword.findMany();

  for (const customer of customers) {
    const assignedKeywords = getRandomSubset(
      keywords,
      3,
    );

    for (const keyword of assignedKeywords) {
      await prisma.customer.update({
        where: {
          id: customer.id,
        },
        data: {
          keywords: {
            connect: {
              id: keyword.id,
            },
          },
        },
      });
    }

    console.log(
      `Assigned ${assignedKeywords.length} keywords to customer with ID: ${customer.id}`,
    );
  }
}

async function main() {
  await assignRandomKeywordsToCustomers();
  console.log(
    'Random keywords have been assigned to the first 50 customers.',
  );
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

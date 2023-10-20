const {
  PrismaClient,
} = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAgentSubmitsDateFields() {
  // Update all agentSubmits with the current date and time
  await prisma.agentSubmits.updateMany({
    data: {
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
}

async function main() {
  await updateAgentSubmitsDateFields();
  console.log(
    'All agentSubmits models have been updated with the current date and time.',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

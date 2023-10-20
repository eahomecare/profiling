const {
  PrismaClient,
} = require('@prisma/client');
const prisma = new PrismaClient();
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function deleteAllAgentSubmits() {
  // Delete all agentSubmits entries
  await prisma.agentSubmits.deleteMany();
}

async function main() {
  rl.question(
    'Are you sure you want to delete all agentSubmits entries? (yes/no) ',
    async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        await deleteAllAgentSubmits();
        console.log(
          'All agentSubmits entries have been deleted.',
        );
      } else {
        console.log('Operation canceled.');
      }
      rl.close();
    },
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

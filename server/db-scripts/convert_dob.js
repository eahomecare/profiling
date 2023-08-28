const {
  PrismaClient,
} = require('@prisma/client');

const prisma = new PrismaClient();

async function convertDateOfBirth() {
  try {
    const customers =
      await prisma.customer.findMany({
        include: {
          personal_details: true,
        },
      });

    for (const customer of customers) {
      const { id, personal_details } = customer;
      if (
        personal_details &&
        personal_details.date_of_birth
      ) {
        const newDOB = new Date(
          personal_details.date_of_birth,
        );
        console.log(typeof newDOB);
        await prisma.personal_Details.update({
          where: { customer_id: id },
          data: { date_of_birth: newDOB },
        });
      }
    }

    console.log(
      'Date of birth conversion completed.',
    );
  } catch (error) {
    console.error(
      'Error converting date of birth:',
      error,
    );
  } finally {
    await prisma.$disconnect();
  }
}

convertDateOfBirth();

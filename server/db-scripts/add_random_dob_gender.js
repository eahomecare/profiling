const {
  PrismaClient,
} = require('@prisma/client');

const prisma = new PrismaClient();

async function addRandomDOBAndGender() {
  try {
    const customers =
      await prisma.customer.findMany({
        include: {
          personal_details: true,
        },
      });

    const genders = ['male', 'female', 'other'];

    for (const customer of customers) {
      const birthYear =
        Math.floor(
          Math.random() * (2006 - 1980),
        ) + 1980;
      const birthMonth =
        Math.floor(Math.random() * 12) + 1;
      const birthDay =
        Math.floor(Math.random() * 28) + 1; // Adjust for months with fewer days
      const randomDOB = new Date(
        `${birthYear}-${birthMonth}-${birthDay}`,
      );

      const randomGender =
        genders[
          Math.floor(
            Math.random() * genders.length,
          )
        ];

      if (customer.personal_details) {
        await prisma.personal_Details.update({
          where: { customer_id: customer.id },
          data: {
            date_of_birth: randomDOB,
            gender: randomGender,
          },
        });
      }
    }

    console.log(
      'Random date of birth and gender addition completed.',
    );
  } catch (error) {
    console.error(
      'Error adding random date of birth and gender:',
      error,
    );
  } finally {
    await prisma.$disconnect();
  }
}

addRandomDOBAndGender();

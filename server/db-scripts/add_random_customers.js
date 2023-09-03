const {
  PrismaClient,
} = require('@prisma/client');
const prisma = new PrismaClient();
const casual = require('casual');

async function createRandomCustomer() {
  const randomMobile = casual.phone;
  const randomEmail = casual.email;
  const randomSource = casual.random_element([
    'homecare',
    'eportal',
    'ezauto',
  ]);

  const customer = await prisma.customer.create({
    data: {
      mobile: randomMobile,
      email: randomEmail,
      source: randomSource,
    },
  });

  const randomFullName = casual.full_name;
  const randomPhoneNumber = casual.phone;
  const randomDateOfBirth = new Date(
    casual.date('YYYY-MM-DD'),
  ); // Convert string to Date object
  const randomGender = casual.random_element([
    'male',
    'female',
  ]);

  const personalDetails =
    await prisma.personal_Details.create({
      data: {
        customer_id: customer.id,
        full_name: randomFullName,
        phone_number: randomPhoneNumber,
        email_address: randomEmail,
        date_of_birth: randomDateOfBirth, // Pass Date object instead of string
        gender: randomGender,
      },
    });

  return { customer, personalDetails };
}

async function main() {
  const no_of_customer_to_add =
    parseInt(process.argv[2], 10) || 2;

  for (
    let i = 0;
    i < no_of_customer_to_add;
    i++
  ) {
    const { customer, personalDetails } =
      await createRandomCustomer();
    console.log(
      `Created customer with id: ${customer.id}`,
    );
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

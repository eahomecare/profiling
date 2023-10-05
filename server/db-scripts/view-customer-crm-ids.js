const {
  PrismaClient,
} = require('@prisma/client');

const prisma = new PrismaClient();

async function printCustomerCRMIds() {
  try {
    const mappings =
      await prisma.customerCRMMapping.findMany({
        where: {
          crmName: 'HC',
        },
        select: {
          customerCrmId: true,
        },
      });

    if (mappings.length) {
      console.log(
        'List of customerCrmIds with crmName "HC":',
      );
      mappings.forEach((mapping) => {
        console.log(mapping.customerCrmId);
      });
    } else {
      console.log(
        'No customerCrmIds with crmName "HC" found.',
      );
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await prisma.$disconnect();
  }
}

printCustomerCRMIds();

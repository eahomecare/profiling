const {
  PrismaClient,
} = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteCustomerCRMIds() {
  try {
    const deletedCount =
      await prisma.customerCRMMapping.deleteMany({
        where: {
          crmName: 'HC',
        },
      });

    if (deletedCount.count > 0) {
      console.log(
        `${deletedCount.count} CustomerCRMMapping records with crmName "HC" were deleted.`,
      );
    } else {
      console.log(
        'No CustomerCRMMapping records with crmName "HC" found.',
      );
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteCustomerCRMIds();

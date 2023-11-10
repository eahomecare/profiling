const {
  PrismaClient,
} = require('@prisma/client');
const prisma = new PrismaClient();

async function removeCustomerAndMappings(
  customerId,
) {
  return prisma.$transaction(async (prisma) => {
    await prisma.personal_Details.deleteMany({
      where: { customer_id: customerId },
    });

    const agentSubmitsToDelete =
      await prisma.agentSubmits.findMany({
        where: { customerID: customerId },
        select: { id: true },
      });

    for (const submit of agentSubmitsToDelete) {
      await prisma.agentSubmitKeywordsMapping.deleteMany(
        {
          where: { agentSubmitId: submit.id },
        },
      );

      await prisma.agentSubmitQuestionsMapping.deleteMany(
        {
          where: { agentSubmitId: submit.id },
        },
      );
    }

    await prisma.agentSubmits.deleteMany({
      where: { customerID: customerId },
    });

    await prisma.occupationCustomerMapping.deleteMany(
      {
        where: { customerId: customerId },
      },
    );

    await prisma.vehicleCustomerMapping.deleteMany(
      {
        where: { customerId: customerId },
      },
    );

    await prisma.profileTypeCustomerMapping.deleteMany(
      {
        where: { customerId: customerId },
      },
    );

    await prisma.serviceCustomerUsageMapping.deleteMany(
      {
        where: { customerId: customerId },
      },
    );

    await prisma.customerSession.deleteMany({
      where: { customerId: customerId },
    });

    await prisma.customerHomecareMapping.deleteMany(
      {
        where: { master_customer_id: customerId },
      },
    );

    await prisma.customerCRMMapping.deleteMany({
      where: { customerId: customerId },
    });

    await prisma.campaign.updateMany({
      where: { customerIDs: { has: customerId } },
      data: { customerIDs: { set: [] } },
    });

    await prisma.customer.delete({
      where: { id: customerId },
    });
  });
}

async function removeLastCustomersAndMappings() {
  const customersToRemove =
    await prisma.customer.findMany({
      take: -800,
      orderBy: { created_at: 'desc' },
    });

  for (const customer of customersToRemove) {
    try {
      await removeCustomerAndMappings(
        customer.id,
      );
      console.log(
        `Removed customer and all related mappings for customer ID: ${customer.id}`,
      );
    } catch (error) {
      console.error(
        `Failed to remove customer and all related mappings for customer ID: ${customer.id}`,
        error,
      );
      throw new Error(
        `Transaction failed for customer ID: ${customer.id}, error: ${error.message}`,
      );
    }
  }
}

async function main() {
  try {
    await removeLastCustomersAndMappings();
    console.log(
      'Last 800 customers and all related mappings have been removed.',
    );
  } catch (error) {
    console.error(
      'Error during the removal process:',
      error,
    );
    process.exit(1);
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});

const {
  PrismaClient,
} = require('@prisma/client');

const prisma = new PrismaClient();

async function removeOrphanedPersonalDetails() {
  try {
    // Fetch IDs of customers that do exist
    const existingCustomerIds =
      await prisma.customer.findMany({
        select: {
          id: true,
        },
      });

    // Fetch IDs of personal details records that are orphaned
    const orphanedPersonalDetailIds =
      await prisma.personal_Details.findMany({
        where: {
          NOT: {
            customer_id: {
              in: existingCustomerIds.map(
                (customer) => customer.id,
              ),
            },
          },
        },
        select: {
          id: true,
        },
      });

    // Delete orphaned personal details records
    if (orphanedPersonalDetailIds.length > 0) {
      await prisma.personal_Details.deleteMany({
        where: {
          id: {
            in: orphanedPersonalDetailIds.map(
              (record) => record.id,
            ),
          },
        },
      });
      console.log(
        `Removed ${orphanedPersonalDetailIds.length} orphaned personal details records.`,
      );
    } else {
      console.log(
        'No orphaned personal details records found.',
      );
    }
  } catch (error) {
    console.error(
      'Error removing orphaned personal details:',
      error,
    );
  } finally {
    await prisma.$disconnect();
  }
}

removeOrphanedPersonalDetails();

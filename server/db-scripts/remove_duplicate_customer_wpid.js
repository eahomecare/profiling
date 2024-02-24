const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteDuplicateCustomersAndProfileMappings() {
  // Step  1: Identify duplicates based on wp_user_id in CustomerHomecareMapping
  const duplicates = await prisma.customerHomecareMapping.groupBy({
    by: ['wp_user_id'],
    _count: true,
  });

  const duplicatesToDelete = duplicates.filter(dup => dup._count > 1);

  for (const dup of duplicatesToDelete) {
    // Step  2: For each duplicate, find all entries except one
    // Since we cannot directly sort by _id in Prisma, we'll sort by createdAt in CustomerHomecare
    // which is assumed to be the closest approximation to MongoDB's default sorting by _id
    const allEntries = await prisma.customerHomecareMapping.findMany({
      where: { wp_user_id: dup.wp_user_id },
      include: {
        customer_homecare: {
          select: {
            createdAt: true,
          },
        },
      },
    });

    // Sort by createdAt of the related CustomerHomecare
    allEntries.sort((a, b) => a.customer_homecare.createdAt - b.customer_homecare.createdAt);

    // Keep the first entry and delete the rest
    const entriesToDelete = allEntries.slice(1);

    for (const entryToDelete of entriesToDelete) {
      // Step  3: Delete the ProfileTypeCustomerMapping entries associated with the duplicate customer
      await prisma.profileTypeCustomerMapping.deleteMany({
        where: { customerId: entryToDelete.customerId },
      });

      // Step  4: Delete the duplicate customer entry
      await prisma.customerHomecareMapping.delete({
        where: { id: entryToDelete.id },
      });
    }
  }
}

deleteDuplicateCustomersAndProfileMappings()
  .then(() => console.log('Duplicate customers and profile mappings deleted successfully.'))
  .catch((error) => console.error('An error occurred:', error))
  .finally(async () => {
    await prisma.$disconnect();
  });

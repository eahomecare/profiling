const {
  PrismaClient,
} = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteDuplicateCustomersAndProfileMappings() {
  // Step  1: Identify duplicates
  const duplicates =
    await prisma.customerHomecareMapping.groupBy({
      by: ['wp_user_id'],
      _count: true,
    });

  const duplicatesToDelete = duplicates.filter(
    (dup) => dup._count > 1,
  );

  console.log(
    'duplicates count:',
    duplicatesToDelete.length,
  );

  for (const dup of duplicatesToDelete) {
    // Step  2: For each duplicate, find all entries except one
    const allEntries =
      await prisma.customerHomecareMapping.findMany(
        {
          where: { wp_user_id: dup.wp_user_id },
          orderBy: { created_at: 'asc' }, // Assuming created_at is a field
        },
      );

    // Keep the first entry and delete the rest
    const entriesToDelete = allEntries.slice(1);

    for (const entryToDelete of entriesToDelete) {
      // Step  3: Delete the ProfileTypeCustomerMapping entries associated with the duplicate customer
      await prisma.profileTypeCustomerMapping.deleteMany(
        {
          where: {
            customerId: entryToDelete.customerId,
          },
        },
      );

      // Step  4: Delete the duplicate customer entry
      await prisma.customerHomecareMapping.delete(
        {
          where: { id: entryToDelete.id },
        },
      );
    }
  }
}

deleteDuplicateCustomersAndProfileMappings()
  .then(() =>
    console.log(
      'Duplicate customers and profile mappings deleted successfully.',
    ),
  )
  .catch((error) =>
    console.error('An error occurred:', error),
  )
  .finally(async () => {
    await prisma.$disconnect();
  });

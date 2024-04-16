const {
  PrismaClient,
} = require('@prisma/client');
const prisma = new PrismaClient();

async function updateBlankGenders() {
  // Find all Personal_Details entries where gender is blank
  const personalDetailsWithBlankGender =
    await prisma.personal_Details.findMany({
      where: {
        gender: '',
      },
    });

  // Update each entry where gender is blank to 'male'
  const updates =
    personalDetailsWithBlankGender.map(
      (detail) => {
        return prisma.personal_Details.update({
          where: {
            id: detail.id,
          },
          data: {
            gender: 'male',
          },
        });
      },
    );

  // Execute all updates concurrently
  await Promise.all(updates);
  console.log(
    `Updated ${updates.length} records.`,
  );
}

async function main() {
  try {
    await updateBlankGenders();
  } catch (e) {
    console.error('Error updating genders:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();

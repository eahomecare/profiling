const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const profileTypesData = [
  { name: 'food', category: 'food' },
  { name: 'sports', category: 'sports' },
  { name: 'travel', category: 'travel' },
  { name: 'music', category: 'music' },
  { name: 'fitness', category: 'fitness' },
  { name: 'automobile', category: 'automobile' },
  { name: 'gadget', category: 'gadget' },
  { name: 'technology', category: 'technology' },
];

async function createProfileTypes() {
  for (const profileTypeData of profileTypesData) {
    await prisma.profileType.create({ data: profileTypeData });
    console.log(`Profile type created: ${profileTypeData.name}`);
  }
}

createProfileTypes()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

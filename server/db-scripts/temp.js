// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// async function convertCategoriesToLowercase() {
//   try {
//     const keywords = await prisma.keyword.findMany();

//     // Update category field for each keyword
//     for (const keyword of keywords) {
//       const newCategory = keyword.category.toLowerCase();
//       await prisma.keyword.update({
//         where: { id: keyword.id },
//         data: { category: newCategory },
//       });
//     }

//     console.log('Keyword categories converted to lowercase successfully.');
//   } catch (error) {
//     console.error('An error occurred:', error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// convertCategoriesToLowercase();

// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// const validCategories = ['food', 'sports', 'travel', 'music', 'fitness', 'automobile', 'gadget', 'technology'];

// async function removeInvalidKeywords() {
//   const keywords = await prisma.keyword.findMany();
//   const invalidKeywords = [];

//   for (const keyword of keywords) {
//     if (!validCategories.includes(keyword.category)) {
//       invalidKeywords.push(keyword.id);
//     }
//   }

//   if (invalidKeywords.length > 0) {
//     await prisma.keyword.deleteMany({
//       where: {
//         id: { in: invalidKeywords },
//       },
//     });

//     console.log(`${invalidKeywords.length} invalid keywords removed.`);
//   } else {
//     console.log('No invalid keywords found.');
//   }
// }

// removeInvalidKeywords()
//   .catch((error) => {
//     console.error(error);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateKeywordLevel() {
  try {
    await prisma.keyword.updateMany({
      data: { level: 2 }, // Set level to 2
    });

    console.log('Keyword levels updated successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateKeywordLevel();



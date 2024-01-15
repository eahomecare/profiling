const {
  PrismaClient,
} = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

async function fetchCitiesAndCountries() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        'Mumbai - India',
        'Delhi - India',
        'Bangalore - India',
        'Hyderabad - India',
        'Ahmedabad - India',
        'Chennai - India',
        'Kolkata - India',
        'Surat - India',
        'Pune - India',
        'Jaipur - India',
        'New York - USA',
        'London - UK',
        'Tokyo - Japan',
        'Paris - France',
        'Berlin - Germany',
      ]);
    }, 1000);
  });
}

// Function to add new location-based keywords
async function addLocationKeywords() {
  const citiesCountries =
    await fetchCitiesAndCountries();
  let duplicateCount = 0;

  for (const pair of citiesCountries) {
    const variations = [
      `${pair} (current location)`,
      `${pair} (travel destination)`,
      `${pair} (home address)`,
    ];

    for (const value of variations) {
      const existingKeyword =
        await prisma.keyword.findFirst({
          where: {
            category: 'persona',
            value: {
              equals: value,
              mode: 'insensitive',
            },
          },
        });

      if (existingKeyword) {
        console.log(
          `Duplicate found and skipped: ${value}`,
        );
        duplicateCount++;
      } else {
        await prisma.keyword.create({
          data: {
            category: 'persona',
            value,
            level: 2,
          },
        });
        console.log(
          `Added new keyword: ${value}`,
        );
      }
    }
  }
  console.log(
    `Keywords processed. Duplicates skipped: ${duplicateCount}`,
  );
}

async function main() {
  try {
    await addLocationKeywords();
  } catch (e) {
    console.error(
      'Error in processing keywords:',
      e.message,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main();

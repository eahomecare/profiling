const {
  PrismaClient,
} = require('@prisma/client');
const {
  Client,
} = require('@elastic/elasticsearch');

const prisma = new PrismaClient();
const elasticClient = new Client({
  node: 'http://localhost:9200',
});

async function transferKeywords() {
  try {
    // Fetch keywords from Prisma (MongoDB)
    const keywords =
      await prisma.keyword.findMany();

    // Check if 'keywords' index exists
    const { body: exists } =
      await elasticClient.indices.exists({
        index: 'keywords',
      });

    // If not, create the index with appropriate mappings
    if (!exists) {
      await elasticClient.indices.create({
        index: 'keywords',
        body: {
          mappings: {
            properties: {
              category: { type: 'text' },
              category_suggest: {
                type: 'completion',
              },
              value: { type: 'text' },
              value_suggest: {
                type: 'completion',
              },
              level: { type: 'integer' },
            },
          },
        },
      });
    }

    // Loop through and index each keyword to Elasticsearch
    for (const keyword of keywords) {
      await elasticClient.index({
        index: 'keywords',
        id: keyword.id,
        body: {
          category: keyword.category,
          category_suggest: keyword.category, // Autocomplete field
          value: keyword.value,
          value_suggest: keyword.value, // Autocomplete field
          level: keyword.level,
        },
      });
    }

    console.log(
      'Keywords transferred successfully.',
    );
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await prisma.$disconnect();
    await elasticClient.close();
  }
}

transferKeywords();


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const duplicateKeywords = [];


async function findAndRemoveDuplicateKeywords() {
    // Find all keywords
    const keywords = await prisma.keyword.findMany();

    const keywordMap = new Map();

    for (const keyword of keywords) {
        const key = `${keyword.value}-${keyword.category}`;

        if (!keywordMap.has(key)) {
            keywordMap.set(key, keyword);
        }
    }


    for (const keyword of keywords) {
        const key = `${keyword.value}-${keyword.category}`;

        if (keywordMap.get(key).id !== keyword.id) {
            duplicateKeywords.push(keyword);
        }
    }

    // Remove duplicate keywords
    for (const duplicateKeyword of duplicateKeywords) {
        await prisma.keyword.delete({
            where: {
                id: duplicateKeyword.id,
            },
        });
        console.log(`Removed duplicate keyword: ${duplicateKeyword.value}, category: ${duplicateKeyword.category}`);
    }
}

async function main() {
    await findAndRemoveDuplicateKeywords();
    console.log(duplicateKeywords.length + ' Duplicate keyword and category combinations have been removed.');
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

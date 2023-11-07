const readline = require('readline');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getKeywordsWithMissingLevel() {
    const keywords = await prisma.keyword.findMany({
        where: {
            level: 2,
        },
    });

    return keywords;
}

async function updateKeywordLevel(keywordId, level) {
    await prisma.keyword.update({
        where: {
            id: keywordId,
        },
        data: {
            level,
        },
    });
}

async function main() {
    const keywordsWithMissingLevel = await getKeywordsWithMissingLevel();
    if (keywordsWithMissingLevel.length === 0) {
        console.log('No keywords with missing levels found.');
        return;
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log('Keywords with missing levels:');
    keywordsWithMissingLevel.forEach((keyword, index) => {
        console.log(`${index + 1}. ${keyword.value}`);
    });

    for (let i = 0; i < keywordsWithMissingLevel.length; i++) {
        const keyword = keywordsWithMissingLevel[i];
        const index = i + 1;

        rl.question(
            `Enter the level for keyword ${index} (${keyword.value}): `,
            async (level) => {
                if (!isNaN(level)) {
                    await updateKeywordLevel(keyword.id, parseInt(level, 10));
                    console.log(`Level for keyword ${keyword.value} updated to ${level}.`);
                } else {
                    console.log(`Invalid input. Please enter a numeric level for keyword ${keyword.value}.`);
                }

                if (i === keywordsWithMissingLevel.length - 1) {
                    console.log('All keywords updated. Exiting.');
                    rl.close();
                    await prisma.$disconnect();
                }
            }
        );
    }
}

main()
    .catch((e) => {
        throw e;
    });

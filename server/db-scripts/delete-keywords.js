const { Client } = require('@elastic/elasticsearch');

const elasticClient = new Client({ node: 'http://localhost:9200' });

async function deleteKeywordsIndex() {
    try {
        const { body: exists } = await elasticClient.indices.exists({ index: 'keywords' });

        if (exists) {
            await elasticClient.indices.delete({ index: 'keywords' });
            console.log("Old 'keywords' index deleted successfully.");
        } else {
            console.log("'keywords' index does not exist.");
        }
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await elasticClient.close();
    }
}

deleteKeywordsIndex();
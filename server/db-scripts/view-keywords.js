const { Client } = require('@elastic/elasticsearch');

const elasticClient = new Client({ node: 'http://localhost:9200' }); // adjust the URL if your Elasticsearch is running elsewhere

async function viewKeywords() {
    try {
        // Fetch keywords from Elasticsearch
        const response = await elasticClient.search({
            index: 'keywords',
            size: 1000, // Fetch up to 1000 results. Adjust as needed.
            body: {
                query: {
                    match_all: {} // This will match and return all documents in the 'keywords' index
                }
            }
        });

        const keywords = response.body.hits.hits.map(hit => hit._source);

        console.log('Keywords in Elasticsearch:');
        keywords.forEach(keyword => {
            console.log(keyword);
        });

    } catch (error) {
        console.error('An error occurred while fetching keywords:', error);
    } finally {
        await elasticClient.close();
    }
}

viewKeywords();
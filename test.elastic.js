var bonsai_url    = 'https://rfw6egd80v:k2xummrezm@self-search-967830556.us-east-1.bonsaisearch.net:443';
var elasticsearch = require('elasticsearch');
var client        = new elasticsearch.Client({
                            host: bonsai_url,
                            log: 'trace'
                        });

// Test the connection:
// Send a HEAD request to "/" and allow
// up to 30 seconds for it to complete.
client.ping({
  requestTimeout: 30000,
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});
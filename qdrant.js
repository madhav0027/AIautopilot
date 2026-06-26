const { QdrantClient } = require('@qdrant/js-client-rest');

const qdrant = new QdrantClient({
    url:process.env.URL,
    apiKey:process.env.API_KEY
})

module.exports = qdrant;
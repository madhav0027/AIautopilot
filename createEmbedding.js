const getEmbedder = require("./embedder");

async function createEmbbeding(text) {
    const extractor = await getEmbedder();

    const output = await extractor(text, {
        pooling:"mean",
        normalize:true
    });

    return Array.from(output.data);
}

module.exports = createEmbbeding;
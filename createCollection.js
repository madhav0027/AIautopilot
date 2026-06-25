const qdrant = require("./qdrant");

async function createCollection() {
    try {
        await qdrant.createCollection("repo_chunks",{
            vectors:{
                size:384,
                distance:"Cosine"
            }
        })
        console.log("Collection created");
    } catch (error) {
        console.log("collection already exists");        
    }
}

module.exports = createCollection;
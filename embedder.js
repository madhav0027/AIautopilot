const {pipeline} = require('@xenova/transformers');

let extractor;

async function getEmbedder (){
    if(!extractor){
        extractor = await pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2"
        )
    }

    return extractor;
}

module.exports = getEmbedder;
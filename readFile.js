const fs = require('fs');
const path = require('path');

const IGNORE = [
    'node_modules',
    '.git',
    'dist',
    'build'
]

function getAllFiles(dir) {
    let results = [];

    const files = fs.readdirSync(dir)

    console.log("Start reading")

    for(const file of files){
        const fullpath = path.join(dir,file);
        const stat = fs.statSync(fullpath);

        if(stat.isDirectory()){
            if(!IGNORE.includes(file)){
                results = results.concat(
                    getAllFiles(fullpath)
                )
            }
        }
        else{
                if(file.endsWith(".js") || 
                   file.endsWith('.ts') || 
                   file.endsWith(".tsx"))
                   results.push(fullpath);
            }
    }

    return results;
}

module.exports = getAllFiles;
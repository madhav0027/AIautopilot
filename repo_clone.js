
function repoclone (git,repo_url,dir){
    git.clone(repo_url,dir)
        .then(() => console.log("Finish Cloning"))
        .catch((err) => console.error("Failed to Clone",err));
}

module.exports = repoclone;


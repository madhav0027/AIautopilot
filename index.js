require('dotenv').config();
const express  = require('express');
const repoclone = require('./repo_clone');
const path = require('path');
const fs = require('fs');
const { default: simpleGit } = require('simple-git');
const getAllFiles = require('./readFile');
const chunk = require('./chunksText');
const createEmbbeding = require('./createEmbedding');
const qdrant = require('./qdrant');
const app = express();
const git = simpleGit()


const PORT = process.env.PORT || 5000;

app.use(express.json())

app.post('v1/repo',async (req,res) => {
    let pointid = 1;
    try {
        // REMOVED 'await' from req.body as it is an object, not a promise
        const { repourl } = req.body; 
        
        if (!repourl) {
            return res.status(400).send("Repository URL is required");
        }

        const repoName = repourl.split('/').pop().replace('.git', '');
        const targetdir = path.resolve(__dirname, './clone_repo');

        if (!fs.existsSync(targetdir)) {
            fs.mkdirSync(targetdir, { recursive: true });
        }

        const targetrepo = path.join(targetdir, repoName);

        // Clones into the ignored folder safely
        await repoclone(git, repourl, targetrepo);

        if (fs.existsSync(targetrepo)) {        
            const result = await getAllFiles(targetrepo);
            console.log("checking");
            console.log(result);
            for(const file of result){
                console.log("indexing ",file)

                const content = fs.readFileSync(file,'utf-8');

                const chunks = await chunk(content);

                for(const chunk of chunks){
                    const embedding = await createEmbbeding(chunk);

                    await qdrant.upsert(
                        "repo_chunks",
                        {
                            wait:true,
                            points:[
                                {
                                    id:pointid++,
                                    vector:embedding,
                                    payload:{
                                        file,
                                        content:chunk
                                    }
                                }
                            ]
                        }
                    )
                }
            }
            res.json({ success: true, files: result });
        } else {
            res.status(500).send("Cloning failed");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/',(req,res) => {
    res.json({
        message:`Autopilot is Running `
    })
})


app.listen(PORT,(err) => {
    if(err)
        console.log(err);
    console.log(`Server is running on PORT ${PORT}`)
})
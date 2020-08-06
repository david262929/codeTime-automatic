const express = require('express');
const upload = require('express-fileupload');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const config = require('config');

const app = express();

const fileExists = path => {
    try {
        fs.statSync(path);
        return true;
    }
    catch (e) {
        // log(e);
        return false;
    }
}

const createFileIfNotExists = path => {
    if(!fileExists(fileExists)){
        fs.closeSync(fs.openSync(path, 'w'));
    }
}

const createDirIfNotExists = dir => {
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

const log = data => {
    const LOG_PATH = path.resolve(__dirname, 'logs/error.log');
    try{
        createFileIfNotExists(LOG_PATH);
        fs.appendFile(LOG_PATH , `Error : ${data}\nDate : ${new Date()}\n`, () => {});
    }catch (e) { console.log(e) }
};

app.use(upload());
app.use(express.static('./'));
// app.use(express.static('./uploads'));
app.use(cors());

app.use(express.json({extended : true}));

app.get('/', (req, res) => {
    res.end(`
        <a href="./about">About</a>
        <br>
        <a href="./upload">Upload</a>
        <h1>Home Page</h1>
    `);
});

app.post('/', (req, res) => {
    const {file} = req.files;
    const dir = path.resolve(`uploads/`);

    createDirIfNotExists(dir);
    
    file.mv( `${dir}/${file.name}`, err => {
        if(err){
            console.log(err);
            log(err);
        }
    })

    res.end(`
        <h1>Spasi</h1>
        <a href="../">Home</a>
    `);
});

app.get('/upload', (req, res) => {
    res.end(`
        <a href="../">Home</a>
        <br>
        <a href="./about">About</a>
        <h1>Upload Page</h1>
        <br>
        <br>
        <br>
        <form action="/" method="POST" enctype="multipart/form-data">
            <input type="file" name="file" />
            <input type="submit" value="Upload" />
        </form>
    `);
});

app.get('/about', (req, res) => {
    res.end(`
        <a href="../">Home</a>
        <br>
        <a href="./upload">upload</a>
        <h1>About Page</h1>
    `);
});


const PORT = config.get('port') || 80;
app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`) );
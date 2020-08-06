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
    } catch (e) {
        // log(e);
        return false;
    }
}

const createFileIfNotExists = path => {
    if (!fileExists(fileExists)) {
        fs.closeSync(fs.openSync(path, 'w'));
    }
}

const createDirIfNotExists = dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

const log = data => {
    try {
        const LOG_DIR = path.resolve(`logs/`);
        createDirIfNotExists(LOG_DIR);
        const LOGFILE_PATH = `${LOG_DIR}/error.log`;
        createFileIfNotExists(LOGFILE_PATH);
        fs.appendFile(LOGFILE_PATH, `Error : ${data}\nDate : ${new Date()}\n`, () => {});
    } catch (e) {
        console.log(e)
    }
};

app.use(upload());
app.use(express.static('./dist'));
// app.use(express.static('./uploads'));
app.use(cors());

app.use(express.json({extended: true}));

app.get('/', (req, res) => {
    res.end(`
        <a href="./about">About</a>
        <br>
        <a href="./upload">Upload</a>
        <h1>Home Page</h1>
    `);
});

app.post('/', (req, res) => {
    try {
        if (!req.files) {
            res.end(`
                <h1>Have not attached a file</h1>
                <a href="../">Home</a>
            `);
        }
        const {file} = req.files;
        const {name} = file;

        if (!name) {
            res.end(`
            <h1>Have not attached a file</h1>
            <a href="../">Home</a>
        `);
        }

        const distDir = path.resolve(`dist/`);
        createDirIfNotExists(distDir);
        const uplaodsDir = `${distDir}/uploads/`;
        createDirIfNotExists(uplaodsDir);

        file.mv(`${uplaodsDir}/${name}`, err => {
            if (err) {
                log(err);
            }
        })
        const fileUrl = `${config.get('baseUrl')}/uploads/${name}`;
        res.end(`
        <p>${fileUrl}</p>
        <h1>Uploaded</h1>
        <a href="../">Home</a>
    `);
    } catch (e) {
        log(e);
        res.status(500).end(`500 Server error.`);
    }
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
            <input type="file" name="file" required/>
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
app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
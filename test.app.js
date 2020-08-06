const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const config = require('config');

const app = express();

app.use(express.static('./logs'));
app.use(cors());
app.use(express.json({extended: true}));

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
        fs.appendFile(LOGFILE_PATH, `Error : ${JSON.stringify(data)}\nDate : ${new Date()}\n`, () => {});
    } catch (e) {
        console.log(e)
    }
};


app.get('/', (req, res) => {
    log({ 'davo' : 'tessssst' });
    res.end(`
        <h1>Test Page</h1>
    `);
});


const PORT = config.get('port') || 80;
app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
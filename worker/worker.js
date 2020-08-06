const fs = require('fs');
const path = require('path');

const fileExists = path => {
    try {
        fs.statSync(path);
        return true;
    } catch (e) {
        return false;
    }
}

const createFileIfNotExists = path => {
    if (!fileExists(path)) {
        fs.closeSync(fs.openSync(path, 'w'));
    }
}

const createDirIfNotExists = dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}
const rename = () => {
    try {
        const LOG_DIR = path.resolve(`logs/`);
        createDirIfNotExists(LOG_DIR);
        const LOGFILE_PATH = `${LOG_DIR}/error.log`;
        createFileIfNotExists(LOGFILE_PATH);
        fs.renameSync(LOGFILE_PATH, `${LOG_DIR}/log.log`, err => {
            if(err) console.log(err)
        });
    } catch (e) {
        console.log(e)
    }
};
rename();
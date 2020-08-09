const path = require('path')
const fs = require('fs')
const parseUrl = require('url-parse')
const scrape = require('website-scraper')
const config = require("config")
const state = config.get('state') || "development"
const makeDir = require('make-dir')
const request = require('request')

const fileExists = path => !!fs.statSync(path)

const createFileIfNotExists = path => {
    if (!fileExists(path)) {
        fs.closeSync(fs.openSync(path, 'w'))
    }
}

const dirExists = dir => fs.existsSync(dir)

async function _makeDir(path) {
    if (dirExists(path)) {
        return path
    }
    await makeDir(path)
    return path;
}

const createDirIfNotExists = dir => new Promise(resolve => {
    if (!dirExists(dir)) {
        _makeDir(dir).then(resolve)
    }
})

/**
 *  It checks is having fileName an extentionName and extentionName is located at the end of fileName
 * @param fileName
 * @param extentionName
 * @returns {boolean}
 */
const haveExtention = (fileName, extentionName) => fileName.indexOf(extentionName) === (fileName.length - extentionName.length)

const log = (data, prefix) => {
    console.log(data)
    try {
        if (prefix) {
            data = {[prefix]: data}
        }
        const LOG_DIR = path.resolve(`logs/`)
        createDirIfNotExists(LOG_DIR)
        const LOGFILE_PATH = `${LOG_DIR}/error.log`
        createFileIfNotExists(LOGFILE_PATH)
        fs.appendFile(LOGFILE_PATH, `Error : ${JSON.stringify(data)}\nDate : ${new Date()}\n`, () => {
        })
    } catch (e) {
        console.log(e)
    }
}

const hashOfRandomNumbers = (length = 1e9) => Math.round(length * Math.random())


// const _createUploadsTempDir = (websitePrefix = '', path = './uploads/projects/') => {
//     const removeEmpties = arr => arr.filter(item => item !== "" && item !== ".")
//
//     if(path === ''){
//         throw "createUploadsTempDir:path parameter is required"
//     }
//
//     websitePrefix = websitePrefix.replace(/\//gi, "-")
//     const folderNames = path.split('/')
//     folderNames.push( websitePrefix + hashOfRandomNumbers() )
//     let dir = ''
//     console.log(removeEmpties(folderNames))
//     try{
//         removeEmpties(folderNames).forEach(folderName => {
//             dir += `${folderName}/`
//             createDirIfNotExists(dir)
//         })
//         return dir
//     }catch (e) {
//         log(e, "createUploadsTempDir" )
//         return false
//     }
// }

async function createUploadsTempDir(websitePrefix = '', path = 'uploads/projects/') {
    if (path === '') {
        throw "createUploadsTempDir:path parameter is required"
    }


    if (path[path.length - 1] !== '/') {
        path += '/'
    }

    path += websitePrefix + hashOfRandomNumbers();

    try {
        _makeDir(path)
        return path
    } catch (e) {
        log(e, "createUploadsTempDir")
        return false
    }
}

const isUrlWorking = (url, method = 'HEAD') => new Promise(resolve => request( {url, method}, (err, res) => {
    const haveError = !!err

    if (haveError) log(err)
    return resolve(!haveError && /4\d\d/.test(res.statusCode) === false)
}));

const scrapper = ({url = 'http://codetime.am/', countryCode = 'AM'}) => new Promise(async (resolve, reject) => {
    try {
        const isUrlWorking = await isUrlWorking()
        if(!isUrlWorking){
            throw("Your Url is not Working.")
        }

        const {hostname, pathname} = parseUrl(url, true)
        const prefix = hostname + pathname

        let tempDir = createUploadsTempDir(prefix) // (Folder || Project) name + HASH
        if (!tempDir) {
            throw("Somenting wne wrong with TEMP DIR creation.")
            return reject()
        }

        tempDir += '/website'
        const options = {
            urls: [url],
            directory: tempDir,
            subdirectories: [
                {directory: 'img', extensions: ['.jpg', '.png', '.svg']},
                {directory: 'js', extensions: ['.js']},
                {directory: 'css', extensions: ['.css']}
            ],
        }

        scrape(options).then((result) => {
            return resolve(tempDir, result)
        })
    } catch (e) {
        log(e, "scrapper")
        return resolve(null)
    }
})

module.exports = {
    _makeDir,
    fileExists,
    dirExists,
    createFileIfNotExists,
    createDirIfNotExists,
    log,
    scrapper,
    createUploadsTempDir,
    haveExtention,
    isUrlWorking,
}
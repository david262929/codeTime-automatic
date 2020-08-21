const path = require('path')
const fs = require('fs')
const parseUrl = require('url-parse')
const scrape = require('website-scraper')
const config = require("config")
const state = config.get('state') || "development"
const makeDir = require('make-dir')
const request = require('request')
const globby = require('globby')


const fileExists = path => {
    try {
        return !!fs.statSync(path)
    }catch (e) {
        return false
    }
}

const createFileIfNotExists = path => new Promise(async resolve => {
    if (!fileExists(path)) {
        fs.closeSync(fs.openSync(path, 'w'));
    }
    return resolve(true);
})

const dirExists = dir => {
    try {
        return !!fs.existsSync(dir)
    }catch (e) {
        return false
    }
}

async function _makeDir(path) {
    if (dirExists(path)) {
        return path
    }
    await makeDir(path)
    return path;
}

const deleteFile = async (filePath) => new Promise(resolve => {
    try {
        if (!fileExists(filePath)) {
            return resolve(true);
        }
        fs.unlink(filePath, (err) => {
            if (err) {
                throw err;
                resolve(false)
            }
            resolve(true)
        });
    }catch (e) {
        return resolve(false)
    }
})

const copyFile = async (filePath, newFilePath) => new Promise(resolve => {
    try {
        if (!fileExists(filePath)) {
            return resolve(true);
        }
        fs.copyFile(filePath, newFilePath, (err) => {
            if (err) {
                throw err;
                resolve(false)
            }
            resolve(true)
        });
    }catch (e) {
        return resolve(false)
    }
})


const getPathAllFiles = async (pathName) => new Promise(async resolve => {
    try {
        if (!await dirExists(pathName)) {
            log(`No such file or directory : getPathAllFiles: ${pathName}`)
            return resolve(false);
        }

        const files = fs.readdirSync(path.resolve(pathName))
        // files.forEach((file, index) => {
        //     console.log(file);
        // })
        return resolve(files);
    } catch (e) {
        return resolve(false);
    }
})

const writeFile = async (filePath, data) => new Promise(resolve => {
    try {
        fs.writeFile(filePath, data, (err) => {
            if (err) return console.error(err);
            return resolve(true)
        })
    } catch (err) {
        throw err;
        log(err);
        resolve(false);
    }
})

const createDirIfNotExists = dir => new Promise(resolve => {
    if (!dirExists(dir)) {
        return _makeDir(dir).then(() => resolve(true))
    }
    resolve(true);
})

const appendIntoLogFile = async (data, logFileName, type) => new Promise(async resolve => {
    const LOG_DIR = path.resolve(`logs/`);
    await createDirIfNotExists(LOG_DIR);
    const LOGFILE_PATH = `${LOG_DIR}/${logFileName}`;
    await createFileIfNotExists(LOGFILE_PATH)
    fs.appendFile(LOGFILE_PATH, `${type} : ${JSON.stringify(data)}\n Date : ${new Date()}\n------------------\n`, resolve);
})

const log = async (data, prefix = null, mode = 'endpoint_main', type = 'error') => {
    console.log({data, prefix, mode, type});


    const allowed = {
        types: ['error', 'message'],
        modes: ['endpoint_main', 'endpoint_compress', 'endpoint_options', 'worker_tasks', 'system_error', 'telegram_bot']
    }
    try {
        if (!data) {
            throw("Not correct 'data'")
        }

        if (!allowed.modes.includes(mode)) {
            throw("Not Allowed 'log' mode")
        }

        if (!allowed.types.includes(type)) {
            throw("Not Allowed 'log' type")
        }

        if (prefix) {
            data = {[prefix]: data}
        }
        await appendIntoLogFile(data, `${type}_${mode}.log`, type)
    } catch (e) {
        console.log(e);
        // log(
        //     {
        //         e,
        //         "details": {data, prefix, mode, type}
        //     },
        //     null,
        //     'system_error',
        //     'error'
        // )
        throw("Something went wrong with logging, please see last logs")
    }
}

const getFilesFromDir = async (patterns , extensions = ['*']) => {
    // await fs.readdir( path.resolve(testFolder), (err, files) => {
    //     console.log(err)
    //     if(err) {
    //         log( JSON.stringify(err), null, 'system_error', 'error' );
    //     }
    //     files.forEach(file => {
    //         console.log(file);
    //     });
    // });

    const filesPaths = await globby(patterns, {
        onlyFiles: true,
        expandDirectories : {
            extensions,
        }
    });
    return filesPaths;
}

/**
 *  It checks is having fileName an extentionName and extentionName is located at the end of fileName
 * @param fileName
 * @param extentionName
 * @returns {boolean}
 */
const haveExtention = (fileName, extentionName) => fileName.indexOf(extentionName) === (fileName.length - extentionName.length)

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

const createUploadsTempDir = async (websitePrefix = '', path = 'uploads/projects/') => new Promise( async resolve => {
    if (path === '') {
        throw "createUploadsTempDir:path parameter is required"
    }


    if (path[path.length - 1] !== '/') {
        path += '/'
    }

    if(websitePrefix !== null){
        path += websitePrefix + hashOfRandomNumbers();
    }

    try {
        await _makeDir(path)
        path = await removeLastSlash(path);
        return resolve( path )
    } catch (e) {
        log(e, "createUploadsTempDir")
        return  resolve( false )
    }
})

const isUrlWorking = async (url, method = 'GET') => new Promise(resolve => request( {url, method}, (err, res) => {
    const haveError = !!err;

    if (haveError) {
        log(err)
        throw err;
        return resolve(false)
    }
    return resolve(!haveError && /4\d\d/.test(res.statusCode) === false)
}));

const removeLastSlash = async (pathname = '') => new Promise( resolve => {
    const splitedPathName = pathname.split('')
    if( splitedPathName.pop() === '/'){
        pathname = splitedPathName.join('');
    }
    resolve(pathname);
})

const scrapper = ({url = 'http://codetime.am/', countryCode = 'AM'}, projectNamePrefix = '') => new Promise(async (resolve, reject) => {
    try {
        const _isUrlWorking = await isUrlWorking(url);
        if(!_isUrlWorking){
            throw("Your Url is not Working.")
            return resolve(false)
        }
        console.log('_isUrlWorking =',_isUrlWorking);

        const curDateWithMilliseconds = (new Date()).getTime()
        let {hostname, pathname} = parseUrl(url, true)

        pathname = await removeLastSlash(pathname);
        const prefix = `${projectNamePrefix}-${hostname}${pathname}`.replace(/\//gm, '-')

        let projectDir = await createUploadsTempDir(null,`uploads/projects/${prefix}-${curDateWithMilliseconds}`) // (Folder || Project) name + HASH

        if (!projectDir) {
            throw("Somenting went wrong with TEMP DIR creation.")
            return resolve(false)
        }

        let websiteDir = `${projectDir}/website`;
        const options = {
            urls: [ url ],
            directory: websiteDir,
            subdirectories: [
                {directory: 'img', extensions: [ '.jpg', '.jpeg', '.gif', '.png' , '.svg']},
                {directory: 'js', extensions: [ '.js' ]},
                {directory: 'css', extensions: [ '.css', ]}
            ],
            sources: [
                {selector: 'img', attr: 'src'},
                {selector: 'link[rel="stylesheet"]', attr: 'href'},
                {selector: 'script', attr: 'src'}
            ],
        }

        scrape(options).then( () => {
            return resolve(projectDir)
        }).catch((err) => {
            throw err;
            resolve(false)
        });
    } catch (e) {
        log(e, "scrapper")
        return resolve(false)
    }
})



const getDirName = (fullPath) => {
    const splitedPath = fullPath.split('/');
    const lastElement = splitedPath.pop();
    return lastElement === '' ? splitedPath.pop() : lastElement;
}

module.exports = {
    _makeDir,
    fileExists,
    dirExists,
    createFileIfNotExists,
    createDirIfNotExists,
    scrapper,
    createUploadsTempDir,
    haveExtention,
    isUrlWorking,
    getFilesFromDir,
    log,
    deleteFile,
    writeFile,
    getPathAllFiles,
    copyFile,
    getDirName,
}
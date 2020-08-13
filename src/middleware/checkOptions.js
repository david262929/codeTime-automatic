const path = require('path')
const fs = require('fs')
const config = require('config')
const {log, scrapper, createDirIfNotExists, haveExtention, isUrlWorking} = require('../functions/functions')
// const {unZip, zipDir} = require('../src/functions/zip')

// unZip( path.resolve('uploads/projects/test-project/archive/archive.zip'), path.resolve('uploads/projects/test-project/website/') )
// zipDir(path.resolve('uploads/projects/test-project/website/'), path.resolve('uploads/projects/test-project/archive/archive3.zip') )
// const {log, scrapper} = require('decompress')

module.exports = async (req, res, next) => new Promise(async resolve => {
    try {
        const task = {};

        const {taskName} = req.body
        if (!taskName) {
            return res.end(`taskName not passed`);
        }
        task.name = taskName;

        const {starterSelector} = req.body;

        console.log('starterSelector=', starterSelector)

        switch (starterSelector) {
            case 'url':
                const {toScrappUrl} = req.body;
                if(!toScrappUrl){
                    return res.end(`Not a normal url.`)
                }

                const _isUrlWorking = await isUrlWorking(toScrappUrl);
                if(!_isUrlWorking){
                    return res.end(`Url is not working.`)
                }
                task.scrapp = toScrappUrl
                // await scrapper({url : `http://newslentalj.com/vit2/feroctilfree/vsemir/`})
                break;
            case 'upload': //zipFile
                const {zipFile} = req.files;
                if(!zipFile){
                    return res.end(`Havn't passed a file.`)
                }

                const haveZipFileExtention = haveExtention(zipFile.name, '.zip');
                if(!haveZipFileExtention){
                    return res.end(`Passed file not a ".zip".`)
                }
                // code block
                // console.log('req.files.zipFile=', req.files.zipFile)

                const {tempDirName, root : {absolute} } = config.get('dir');

                const curDateWithMilliseconds = (new Date()).getTime()
                const newZipFileDirName = `${absolute}${tempDirName}/projects/${taskName}-${curDateWithMilliseconds}/archive`;
                await createDirIfNotExists(newZipFileDirName);

                const newZipFilePath = `${newZipFileDirName}/archive.zip`;
                zipFile.mv(newZipFilePath, err => {
                    if (err) {
                        log(err)
                        return res.end('Something went wrong with moving zip between fileSystem dirs ')
                    }
                })

                task.zipArchive = newZipFilePath;
                // const isZipFile = await isZip(newZipFilePath);
                // console.log( isZipFile ? 'true' : 'false' )

                // unZip()
                break;
            default:
            // code block
        }

        const {department} = req.body;

        if( !['vitrina'].includes(department) ){
            return res.end(`Not allowed Department type`)
        }
        task.department = department;

        const {productOldName, productNewName} = req.body;

        if( !!productOldName && !!productNewName){
            return res.end(`Not allowed Department type`)
        }

        task.nameReplacement = [{
            old : productOldName,
            new : productNewName,
        }];


        req.task = task;
        // log({way : })
        // res.end(`OK`);
        // next();
        resolve();
        next();
    } catch (e) {
        log(e);
        return res.end(`CHOK`);
        // return res.status(401).json({message: 'Not authorized'});
    }
})
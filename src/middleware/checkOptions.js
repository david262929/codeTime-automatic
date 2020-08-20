const path = require('path')
const fs = require('fs')
const config = require('config')
const {log, haveExtention, isUrlWorking, createUploadsTempDir} = require('../functions/automatic.functions')

// unZip( path.resolve('uploads/projects/test-project/archive/archive.zip'), path.resolve('uploads/projects/test-project/website/') )
// zipDir(path.resolve('uploads/projects/test-project/website/'), path.resolve('uploads/projects/test-project/archive/archive3.zip') )
// const {log, scrapper} = require('decompress')

module.exports = async (req, res, next) => new Promise( async resolve => {
    try {
        const task = {};

        const {telegramID} = req.body
        if (!telegramID) {
            return res.end(`telegramID not passed`);
        }
        task.telegramID = telegramID;

        const {taskName} = req.body
        if (!taskName) {
            return res.end(`taskName not passed`);
        }

        task.name = taskName;

        const {starterSelector} = req.body;
        const files = {
            type : 'zip',
            data : '',
        }
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
                files.type = 'url';
                files.data = toScrappUrl;
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

                const curDateWithMilliseconds = (new Date()).getTime()
                let newProjectDir = await createUploadsTempDir(null, `uploads/projects/${taskName}-${curDateWithMilliseconds}`) // (Folder || Project) name + HASHs
                let newZipFileDirName = await createUploadsTempDir(null, `${newProjectDir}/archive`)

                console.log(newZipFileDirName);
                const newZipFilePath = `${newZipFileDirName}/archive.zip`;
                zipFile.mv(newZipFilePath, err => {
                    if (err) {
                        log(err)
                        return res.end('Something went wrong with moving zip between fileSystem dirs ')
                    }
                })

                files.type = 'zipFile';
                files.data =  newProjectDir
                // const isZipFile = await isZip(newZipFilePath);
                // console.log( isZipFile ? 'true' : 'false' )

                // unZip()
                break;
            default:
            // code block
        }
        task.files = files;

        const {department} = req.body;
        if( !['vitrina'].includes(department) ){
            return res.end(`Not allowed Department type`)
        }
        task.department = department;

        const {productOldName, productNewName} = req.body;
        if( !!productOldName && !productNewName){
            return res.end(`Old and New produtNames are required.`)
        }
        task.nameReplacements = [{
            oldName : productOldName,
            newName : productNewName,
        }];


        const {hashToken} = req.body;
        if( !hashToken ){
            return res.end(`Have Not 'hashToken'`)
        }
        task.hashToken = hashToken;


        console.log('hashToken = ',hashToken)
        req.task = task;
        console.log('task = ',task)
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
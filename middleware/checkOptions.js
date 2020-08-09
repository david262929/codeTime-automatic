const path = require('path')
const fs = require('fs')
const config = require('config')
const {log, scrapper, createDirIfNotExists, haveExtention} = require('../functions/functions')
// const {unZip, zipDir} = require('../functions/zip')

// unZip( path.resolve('uploads/projects/test-project/archive/archive.zip'), path.resolve('uploads/projects/test-project/website/') )
// zipDir(path.resolve('uploads/projects/test-project/website/'), path.resolve('uploads/projects/test-project/archive/archive3.zip') )
// const {log, scrapper} = require('decompress')

module.exports = async (req, res, next) => {
    try {
        const {taskName} = req.body
        if (!taskName) {
            return res.end(`taskName not passed`);
        }

        const {starterSelector} = req.body;
        let file = {
            type: 'zipFile',
            path: '',
        }

        console.log('starterSelector=', starterSelector)

        switch (starterSelector) {
            case 'url':
                // await scrapper({url : `http://newslentalj.com/vit2/feroctilfree/vsemir/`})
                break;
            case 'upload': //zipFile
                const {zipFile} = req.files;
                if(!zipFile){
                    throw(`Havn't passed a file.`)
                }

                const haveZipFileExtention = haveExtention(zipFile.name, '.zip');
                if(!haveZipFileExtention){
                    throw(`Passed file not a ".zip".`)
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
                        log('aaa'+err)
                    }
                })

                // const isZipFile = await isZip(newZipFilePath);
                // console.log( isZipFile ? 'true' : 'false' )

                // unZip()
                break;
            default:
            // code block
        }

        // console.log('req.files.zipFile=', req.files.zipFile)
        file.type = starterSelector;

        req.checkesOptions = {
            file,
        }
        // log({way : })
        // res.end(`OK`);
        // next();
        return res.end(`ok`);
    } catch (e) {
        log(e);
        return res.end(`CHOK`);
        // return res.status(401).json({message: 'Not authorized'});
    }
}
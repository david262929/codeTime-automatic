const fs = require('fs')
const decompress = require('decompress')
const path = require('path')
const compressing = require('compressing')
const decompressUnzip = require('decompress-unzip')
const node_ratify = require('node-ratify')
const {createUploadsTempDir, _makeDir, log, haveExtention} = require('./index')

let dest = `uploads/projects/`;
(async () => {
    await _makeDir(path.resolve(`${dest}`))
})()

// console.log(tarball)

// async function unzip () {
//     decompress('25-new.zip', path.resolve('./archives/exported'), {
//         plugins: [
//             decompressUnzip()
//         ]
//     }).then(() => {
//         console.log('Files decompressed')
//     })
// }

const unZip = async (zipFileDir = '', pathToExtract = '') => new Promise(async resolve => decompress(zipFileDir, pathToExtract, {
    plugins: [
        decompressUnzip()
    ]
}).then( () => resolve(true) ))
// unZip( path.resolve('uploads/projects/test-project/website/') , path.resolve('uploads/projects/test-project/archive/archive.zip') )

// const zip = () => new Promise( async (resove, reject) => {
//     compressing.tar.compressDir('./dist/', path.resolve('./archives/archive1.zip') ).then(() => {
//         console.log('aaaaaa')
//     }).catch((err) => {
//         console.log('erororororororrrr')
//         console.log(err)
//     })
// })

const zipDir = (pathToZip = '', newzipFileDir = '') => new Promise(async resolve => compressing.tar.compressDir(pathToZip, newzipFileDir).then(() => {
        resolve(true)
        console.log('aaaaaa')
}).catch((err) => {
    resolve(false)
    console.log('erororororororrrr')
    console.log(err)
}))

// zipDir(path.resolve('uploads/projects/test-project/website/'), path.resolve('uploads/projects/test-project/archive/archive1.zip') )

/**
 *
 * @param path
 * @param deeply:   It means for will check is real zip file with decoded buffer
 * @returns {Promise<unknown>}
 */
const isZip = (zipFullPath, deeply = false) => new Promise(resolve => {
    if (!node_ratify.isString(zipFullPath)) {
        log('provided zipFullPath is not correct');
        return resolve(false)
    }

    if (!deeply) {
        return resolve(haveExtention(zipFullPath, '.zip'))
    }

    // const buffer = new Buffer(4);
    const buffer = Buffer.alloc(4);
    fs.open(zipFullPath, 'r', (err, fd) => {
        if (err) {
            return log(err);
        }
        return fs.read(fd, buffer, 0, 4, 0, (err, bytesRead, _buffer) => {
            if (err) {
                return fs.close(fd, (err1) => {
                    resolve(false)
                    log(err1)
                });
            }

            const haveZipBuffer = (
                (!!_buffer && _buffer.length === 4)
                &&
                _buffer[0] === 0x50
                &&
                _buffer[1] === 0x4b
                &&
                [0x03, 0x05, 0x07].includes(_buffer[2])
                &&
                [0x04, 0x06, 0x08].includes(_buffer[3])
            )

            fs.close(fd)
            return haveZipBuffer;
        });
    });
});


module.exports = {
    unZip,
    zipDir,
    isZip
}
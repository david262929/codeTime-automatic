// const log = require('./src/functions/logger');
//
// // into ./logs/error_worker_tasks.log >>  "ERROR - blablabla"
// log( ["ERROR", 'blablabla'].join(' - '), null, 'worker_tasks', 'error' );
//
// // into ./logs/error_worker_tasks.log >>  "{_log_log _ 'ERROR - blablabla'}"
// log( ["ERROR", 'blablabla'].join(' - '), '_log_log', 'worker_tasks', 'error' );
//
//
// // into ./logs/message_worker_tasks.log >>  "MEssage - blablabla"
// log( ["MEssage", 'blablabla'].join(' - '), null, 'worker_tasks', 'message' );
//
// // into ./logs/message_worker_tasks.log >>  "{_log_log _ 'MEssage - blablabla'}"
// log( ["MEssage", 'blablabla'].join(' - '), '_log_log', 'worker_tasks', 'message' );


// const taskQueue = require('./src/functions/queue/redis');
// const template = { email : 'test'};
//
// [1,1,1,1,1].forEach((el, index) => {
//     template.email += (1 + index)
//     taskQueue.enqueue(template)
// })



// const path = require('path')
// const scrape = require('website-scraper')
// const config = require("config")
//
// const options = {
//     urls: [
//         `${config.get('baseRealUrl')}/uploads/projects/ukraina-i3/index.html`
//     ],
//     directory: path.resolve('uploads/projects/ukraina-i3-done'),
//     subdirectories: [
//         {directory: 'img', extensions: ['.jpg', '.png', '.svg']},
//         {directory: 'js', extensions: ['.js']},
//         {directory: 'css', extensions: ['.css']}
//     ],
//     sources: [
//         {selector: 'img', attr: 'src'},
//         {selector: 'link[rel="stylesheet"]', attr: 'href'},
//         {selector: 'script', attr: 'src'}
//     ],
// }
//
// scrape(options).then((result) => {
//     return console.log(result)
// })


const fs = require('fs');
const path = require('path');
// require('./src/tools/htmlParser')

const dirExists = dir => {
    try {
        return !!fs.existsSync(dir)
    }catch (e) {
        return false
    }
}

const getPathAllFiles = async (pathName) => new Promise( resolve => {
    const files = fs.readdirSync( path.resolve(pathName) )
    // files.forEach( (file, index) => {
    //     console.log(file);
    // })
    return resolve (files);
})

const renameImgPathName = async (websitePath = '', childDirNameFrom = 'img', childDirNameTo = 'images') => new Promise(resolve => {
    if(websitePath === ''){
        return resolve(false);
    }

    const imagesCurPath = `${websitePath}/${childDirNameFrom}`;
    if( !dirExists(imagesCurPath) ){
        return resolve(false);
    }

    const newPath = `${websitePath}/${childDirNameTo}`;
    fs.rename(imagesCurPath, newPath, async (err) => {
        if (err) {
            log(err)
            throw err;
            return resolve(false);
        }
        console.log(await getPathAllFiles(newPath, ));
        console.log('renamed complete');
        return resolve(newPath);
    })
})

const generateSelector = async () => new Promise(resolve => {
    `img[src*='img/profile.jpg']`
})

x = async () => {
    const websiteDir = path.resolve('uploads/projects/david262929.com-1597405545192/website');
    const isRenamed = await renameImgPathName(websiteDir);
    console.log('isRenamed = ', isRenamed)
    if(isRenamed){
        const data = fs.readFileSync(`${websiteDir}/index.html`,
            {encoding:'utf8', flag:'r'});


        document.querySelectorAll(`img[src*='img/profile.jpg']`);

        const { parse } = require('node-html-parser');
    }
}
x()
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

// const productRename = async ($, nameReplacements) => new Promise( resolve => {
//     const curState = $.html();
//     curState.replace('Диалайф', 'xuyxuyxuy' )
//     nameReplacements.forEach( nameReplacement => {
//         const {oldName, newName} = nameReplacement;
//         curState.replace(oldName, newName )
//         console.log('aaaaaaa')
//     })
//
//     console.log( curState );
//     $("html").html( curState );
//     resolve(true);
// })
//
// const fs = require('fs');
// const path = require('path');
// const cheerio = require('cheerio');
// const utf8 = require('utf8');
// const htmlparser2 = require('htmlparser2');
// // require('./src/tools/htmlParser')
//
// const htmlPath = path.resolve( `uploads/projects/sayt-1597467065643/website/yob.html` );
// const htmlString = fs.readFileSync(htmlPath, {"encoding": "utf8", "flag": "r"});
//
//
// const dom = htmlparser2.parseDOM(htmlString, {
//     xml: {
//         withDomLvl1: true,
//         normalizeWhitespace: false,
//         xmlMode: true,
//         decodeEntities: true
//     }
// });
//
// const $ = cheerio.load( dom );
//
//
// const nameReplacements = [ { oldName: 'pageFirst', newName: 'Gagooooooo' } ]
// let curState = $('html').html().toString();
//
// // console.log(curState)
// // if( !!nameReplacements.length ){
//
// const {oldName, newName} = nameReplacements[0];
//
// // curState.indexOf('body')
//
// console.log(curState.indexOf('pageFirst'))
// curState = curState.split('pageFirst').join( 'Gagooooooo' )
//
// // console.log('aaaaaaa')
//
// $('html').html(curState);
// console.log($('html').html());
// const path = require('path');
// const {_compressImages} = require('./src/functions/img/index')
// console.log(path.resolve('./uploads/toScrapp/img'));
//
// const x = async () => {
//     console.log('_compressImages done = ', await _compressImages(
//
//         path.resolve('./uploads/toScrapp/img'),
//         ['png', 'jpg', 'jpeg', 'JPG', 'JPEG'],
//         path.resolve('./uploads/toScrapp/img_dist/img_dist')
//     ))
// }
// x();

// require('./worker/sayHello')
    // productRename($, nameReplacements);
// }

// const path = require('path');
// const fs = require('fs');
// const {_autoprefixer} = require('./src/functions/img/index.js')
//
// const websitePath = path.resolve('./uploads/projects/test-delete-aaaa-1597684539796/website');
//
// console.log('websitePath = ', websitePath);
//
// const x = async () => {
//     console.log('Started _autoprefixer')
//     console.log(path.resolve( `${websitePath}/css`));
//     console.log('_autoprefixer done = ' , await _autoprefixer(path.resolve(`${websitePath}/css`), path.resolve(`${websitePath}/css`)))
// }
// x();
const redis = require('./src/functions/redis')
console.log(redis);

const x = async () => {
    await redis.connect();

    const {client} = redis;

    client.hmset("users", {
        user_id_1: JSON.stringify({
            name : 'Gago'
        })
    });

    client.hgetall("users", function (err, object) {
        console.log(object);
    });
}

x();
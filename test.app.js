const log = require('./src/functions/logger');

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


// // Import dependencies
// console.clear();
// const imagemin = require("imagemin")
// // const imageminJpegtran = require("imagemin-jpegtran");
// // // const imageminPngquant = require("imagemin-pngquant");
// // // const imageminGifsicle = require("imagemin-gifsicle");
// // // const imageminSvgo = require("imagemin-svgo");
// // // const imageminOptipng = require("imagemin-optipng");
// const imageminGuetzli = require('imagemin-guetzli');
// // //
// (async () => {
//     // Optimize the image size
//     console.log(`Optimizing`)
//     const files = await imagemin(["original-images/*.{jpg,png}"], {
//         destination: "optimised-images",
//         plugins: [
//             imageminGuetzli({quality: 95}),
//             // imageminGuetzli({quality: 85}),
//             // imageminGuetzli({quality: 85}),
//             // imageminGuetzli({quality: 85}),
//             // imageminGuetzli({quality: 85}),
//         ]
//     })
//
//     // Show amount of images optimize
//     console.log(`Optimized ${files.length} images`)
//
// })()
//
// const tinify = require("tinify");
// tinify.key = "TVx1GRNKqvWD8T93np3ZVqXWYGBSL68N";
//
// (async () => {
//     const source = tinify.fromFile("original-images/original.jpg")
//     await source.toFile("optimised-images/original.jpg")
// })()


// const {promisify} = require('util');
// const globby = require('globby');
// const fs = require('fs');
// // const readFile = promisify(fs.readFile);
//
// (async () => {
//
//     const filePaths = await globby(['src/functions/*'], {onlyFiles: false});
//     console.log(filePaths);
//     // console.log(await readFile('./functions/views/.*'));
// })()


const imagemin = require("imagemin")
// const imageminJpegtran = require("imagemin-jpegtran");
// const imageminPngquant = require("imagemin-pngquant");
// const imageminGifsicle = require("imagemin-gifsicle");
// const imageminSvgo = require("imagemin-svgo");
// const imageminOptipng = require("imagemin-optipng");
const imageminGuetzli = require('imagemin-guetzli');
//
const imgCompress = async (inputFilesPath = 'original-images/*.{jpg,png,ico}', outputFilesDir = 'optimised-images') => {
    // Optimize the image size
    if (!Array.isArray(inputFilesPath)) {
        inputFilesPath = [inputFilesPath]
    }

    try {
        const files = await imagemin(inputFilesPath, {
            glob: false,
            destination: outputFilesDir,
            plugins: [
                // imageminGifsicle(),
                // imageminJpegtran(),
                // imageminOptipng(),
                // imageminPngquant(),
                // imageminSvgo(),
                imageminGuetzli({quality: 95}),
            ]
        })
        return files.length
    } catch (err) {
        console.log(err)
        log(JSON.stringify(err), null, 'system_error', 'error');
        return false;
    }
}
//
//
// console.clear()
const {getFilesFromDir} = require('./src/functions/functions');

// const imgCompress = require('./src/tools/imgOptimize');

(async () => {

    // console.log( getFilesFromDir('src/functions/', ['js']) )
    let imgs = await getFilesFromDir('uploads/projects/newslentalj.com-vit2-feroctilfree-vsemir-525114465/website/img/', ['png'])

    console.log(imgs);

    const filesCompressed = await imgCompress(imgs, 'optimised-images')
    //
    console.log('filesCompressed', filesCompressed);

})()

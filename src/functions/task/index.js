const gulp = require('gulp');
const path = require('path');
const {
    _webp,
    _resizeWIthWidth,
    _guetzli,
    _mozjpeg,
    _images,
    _tinypng,
    _resize,
} = require('../img');
const concatCss = require('gulp-concat-css');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const gulpuncss = require('gulp-uncss');
const {log, deleteFile, scrapper} = require('../functions');
const {unZip} = require('../zip');
const redisQueue = require("../queue/redis");

console.log('aaa', deleteFile);


// Конкатенация css
const _concatCss = () => gulp.src('./css/*.css')
    .pipe(concatCss("./style.min.css"))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulpuncss({
        html: ['index.html'],
        ignore: ['.super-rotation', '.rotated']
    }))
    .pipe(gulp.dest('./css/'))

// Конкатенация js
const _concatJs = () => gulp.src(['./js/jquery-2.2.4.min.js', './js/jquery.cookie.min.js', './js/purl.min.js', './js/jquery.inputmask.bundle.min.js', './js/price.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./js/'))

// Компресия js
const _compressJs = () => gulp.src(['./js/all.js'])
    .pipe(minify())
    .pipe(gulp.dest('js'))


const addTask = async (task) => new Promise( async resolve => {
    if(!task){
        return resolve(false)
    }
    try {
        const _addedTask = await doTask(task)
        // const _addedTask = await redisQueue.enqueue(task)
        return resolve( !!_addedTask )
    }catch (e) {
        log(e);
        return resolve(false)
    }
})


const doTask = async ( options = {}) => new Promise(async resolve => {
    const {department} = options;


    const {files: {type, data}} = options;

    if(!type || !data){
        throw('Url/Zip have incorrect DATA');
        return resolve(false)
    }

    switch(type){
        case 'url':
            console.log( await scrapper({url : data}))
            break;
        case 'zipFile':
            const zipFilePath = `${data}archive.zip`;
            console.log( 'unzip ',await unZip(path.resolve(zipFilePath), path.resolve(`${data}/../website/`)) )
            console.log( 'delete zipFilePath = ', zipFilePath, await deleteFile(zipFilePath))
            break;
    }




    console.log('All was done');
})


module.exports = {
    _webp,
    _resizeWIthWidth,
    _guetzli,
    _mozjpeg,
    _images,
    _concatCss,
    _concatJs,
    _compressJs,
    _tinypng,
    _resize,
    doTask,
    addTask,
};
// console.log(gulp.start(
//     'resize'
// ))
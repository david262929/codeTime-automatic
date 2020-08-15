const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
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
const {log, deleteFile, scrapper, dirExists, writeFile, getPathAllFiles} = require('../index');
const {unZip} = require('../zip');
const cheerio = require('cheerio')
const redisQueue = require("../queue/redis");

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

// require('./src/tools/htmlParser')

const generateSelector = async (imagesPath = [], selectorTemplate = `img[src*='img/%s']`) => new Promise(resolve => {
    resolve(imagesPath.map(pathFile => selectorTemplate.replace('%s', pathFile)))
})

const renameImgPathName = async (websitePath = '', childDirNameFrom = 'img', childDirNameTo = 'images') => new Promise(resolve => {
    if (websitePath === '') {
        return resolve(false);
    }

    const imagesCurPath = `${websitePath}/${childDirNameFrom}`;
    if (!dirExists(imagesCurPath)) {
        return resolve(false);
    }

    const newPath = `${websitePath}/${childDirNameTo}`;
    fs.rename(imagesCurPath, newPath, async (err) => {
        if (err) {
            log(err)
            throw err;
            return resolve(false);
        }
        console.log('renamed complete');
        return resolve(newPath);
    })
})

const addTask = async (task) => new Promise(async resolve => {
    if (!task) {
        return resolve(false)
    }
    try {
        const _addedTask = await doTask(task)
        // const _addedTask = await redisQueue.enqueue(task)
        return resolve(!!_addedTask)
    } catch (e) {
        log(e);
        return resolve(false)
    }
})

const imagesDirRename = async ($, websiteAbsPath) => new Promise(async resolve => {
    try {

        const childDirNameFrom = 'images';
        const childDirNameTo = 'img';

        const isRenamed = await renameImgPathName(websiteAbsPath, childDirNameFrom, childDirNameTo);
        console.log('isRenamed = ', isRenamed);

        if (!isRenamed) {
            resolve(false)
            return;
        }

        const imagesPath = await getPathAllFiles(isRenamed) // isRenamed == newPath
        console.log(imagesPath);

        const imagesimagesDirRenameSelectorForHTML = (await generateSelector(imagesPath, `img[src*='%d/%s']`.replace('%d', childDirNameFrom))).join(', ')

        const $imagesToRefactor = $(imagesSelectorForHTML);
        $imagesToRefactor.each((index, $image) => {
            $image = $($image);
            const oldSrc = $image.attr('src');
            const newSrc = oldSrc.replace(`${childDirNameFrom}/`, `${childDirNameTo}/`);
            $image.attr('src', newSrc);
            console.log($image.attr('src'))
        })

        // rename img files in csses

        const cssPath = `${websiteAbsPath}/css`;
        const cssFilesPath = await getPathAllFiles(cssPath) // isRenamed == newPath
        console.log('cssFilesPath = ', cssFilesPath);

        cssFilesPath.map(async cssFilePath => { // WHY map not forEach, for "async cssFilePath" not saying -"Please checkout from forEach to for_loop "
            try {
                const curCssPath = `${cssPath}/${cssFilePath}`

                const data = fs.readFileSync(curCssPath, {"encoding": "utf8", "flag": "r"});
                if (data.includes(`${childDirNameFrom}/`) || data.includes(`${childDirNameFrom}/`)) { // TODO: This ugly task about checking in css, if have old img name, it will replaced;

                    const updatedCss = data.replace(`${childDirNameFrom}/`, `${childDirNameTo}/`);

                    const isCssWroted = await writeFile(curCssPath, updatedCss);
                    console.log('isCssWroted = ', isCssWroted, curCssPath);
                }
            } catch (e) {
                log(e);
            }
        });

        resolve(true)
    } catch (e) {
        log(e)
        throw e;
        resolve(false)
    }
})

const addImgAlts = $ => $(`img:not([alt])`).each((index, $imgEl) => {
    $imgEl = $($imgEl)
    $imgEl.attr('alt', '')
})

const hrefToOffer = ($, offer = '{offer}') => $(`a[href]`).each((index, $imgEl) => {
    $imgEl = $($imgEl)
    $imgEl.attr('href', offer)
})

const removeMetaInfo = $ => $(`
    meta[property*="og"], 
    meta[name="author"],
    meta[name*="msapplication-"],
    meta[name*="theme-color"],
    link[rel="icon"], 
    link[rel="apple-touch-icon"]
`).remove()

const doTask = async (options = {}) => new Promise(async resolve => {
    const {department} = options;

    const {files: {type, data}} = options;

    if (!type || !data) {
        throw('Url/Zip have incorrect DATA');
        return resolve(false)
    }

    let websitePath = '';
    switch (type) {
        case 'url':
            const projectTemp = await scrapper({url: data})
            websitePath = `${projectTemp}/website`;
            break;
        case 'zipFile':
            const zipFilePath = `${data}/archive/archive.zip`;
            websitePath = `${data}/website`;
            console.log('unzip ', await unZip(path.resolve(zipFilePath), path.resolve(websitePath)))
            console.log('delete zipFilePath = ', zipFilePath, await deleteFile(zipFilePath))
            break;
    }

    const websiteAbsPath = path.resolve(websitePath);
    const htmlPath = `${websiteAbsPath}/index.html`;
    const htmlString = fs.readFileSync(htmlPath, {"encoding": "utf8", "flag": "r"});

    const $ = cheerio.load(htmlString, {
        xml: {
            withDomLvl1: true,
            normalizeWhitespace: false,
            xmlMode: true,
            decodeEntities: true
        }
    });

    await imagesDirRename($, websiteAbsPath);

    // img alt=""
    addImgAlts($)

    // href value => {offer}
    hrefToOffer($)

    // remove Favicons/Manifest/Author/
    removeMetaInfo($)



    const isHtmlWroted = await writeFile(htmlPath, $.html());
    console.log('wroted = ', isHtmlWroted);

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
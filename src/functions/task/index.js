const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const config = require('config');
const notify = require('../telegram.notify');
const {
    _webp,
    _resizeWIthWidth,
    _guetzli,
    _mozjpeg,
    _images,
    _tinypng,
    _resize,
    _autoprefixer,
    _compressImages,
} = require('../img');
const concatCss = require('gulp-concat-css');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const gulpuncss = require('gulp-uncss');
const {log, deleteFile, scrapper, dirExists, writeFile, getPathAllFiles, fileExists, _makeDir} = require('../automatic.functions');
const {unZip, zipDir} = require('../zip');
const cheerio = require('cheerio')
const redisQueue = require("../queue/redis");
const indexAllowedTypes = ['index.php', 'index.html'];
const moveFile = require('move-file');


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
        console.log('_addedTask = ', _addedTask);
        return resolve(_addedTask)
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

        const imagesSelectorForHTML = (await generateSelector(imagesPath, `img[src*='%d/%s']`.replace('%d', childDirNameFrom))).join(', ')

        const $imagesToRefactor = $(imagesSelectorForHTML);
        $imagesToRefactor.each((index, $image) => {
            $image = $($image);
            const oldSrc = $image.attr('src');
            const newSrc = oldSrc.replace(`${childDirNameFrom}/`, `${childDirNameTo}/`);
            $image.attr('src', newSrc);
        })

        $(imagesSelectorForHTML).each((index, $image) => console.log($.html($image)));

        // rename img files in csses
        const cssPath = `${websiteAbsPath}/css`;
        const cssFilesPath = await getPathAllFiles(cssPath) // isRenamed == newPath
        console.log('cssFilesPath = ', cssFilesPath);
        if(!cssFilesPath.length){
            return resolve(true);
        }

        cssFilesPath.map(async (cssFilePath, index) => { // WHY map not forEach, for "async cssFilePath" not saying -"Please checkout from forEach to for_loop "
            try {
                const curCssPath = `${cssPath}/${cssFilePath}`

                const data = fs.readFileSync(curCssPath, {"encoding": "utf8", "flag": "r"});
                if (data.includes(`${childDirNameFrom}/`) || data.includes(`${childDirNameFrom}/`)) { // TODO: This ugly task about checking in css, if have old img name, it will replaced;

                    const updatedCss = data.replace(`${childDirNameFrom}/`, `${childDirNameTo}/`);

                    const isCssWroted = await writeFile(curCssPath, updatedCss);
                    console.log('isCssWroted = ', isCssWroted, curCssPath);

                    if(index === cssFilesPath.length - 1){
                        console.log('Ended imagesDirRename refactor')
                        resolve(true);
                    }
                }
            } catch (e) {
                log(e);
                console.log(e);
            }
        });
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
    link[rel="shortcut"],
    link[rel="apple-touch-icon"]
`).remove()

const productRename = async ($, nameReplacements) => new Promise(async resolve => {
    try {
        let curState = $('html').html();
        nameReplacements.forEach(nameReplacement => {
            const {oldName, newName} = nameReplacement;
            curState = curState.split(oldName).join(newName)
        })
        resolve(curState);
    }catch (e) {
        resolve(false)
        log(e)
        console.log(e);
    }
})

// Cheked
const toComment = ($, ...selectors) =>  $(`${selectors.join(', ')}`).each((index, $tag) => $($tag).replaceWith($(`<!-- Commented ${$.html($tag)}-->`)))

const toEmptyFormTagActionAttr = $ => $('form[action]').removeAttr('action')

const removeAnchorTargetAttr = $ => $('a[target]').removeAttr('target')

const addJquery = $ => $('head').prepend(`<script
  src="https://code.jquery.com/jquery-3.5.1.min.js"
  integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
  crossorigin="anonymous"></script>`)

const addHashToken = ($, hashToken) => $('body').attr('data-hash', hashToken)

const addCountryCode = $ => $('body').append(`<select name="country" style="display: none"></select>`);

const doTask = async (options = {}) => new Promise(async resolve => {
    try {
        const {department} = options;

        const {files: {type, data}} = options;

        if (!type || !data) {
            throw('Url/Zip have incorrect DATA');
            return resolve(false)
        }

        let websitePath = '';
        const projectDir = data;
        switch (type) {
            case 'url':
                const projectTemp = await scrapper({url: data})
                websitePath = `${projectTemp}/website`;
                _makeDir(path.resolve(`${websitePath}/../archive`))
                break;
            case 'zipFile':
                const zipFilePath = `${data}/archive/archive.zip`;
                websitePath = `${data}/website`;
                await _makeDir(websitePath);
                const unZiped = await unZip(path.resolve(zipFilePath), path.resolve(websitePath))
                if(!unZiped){
                    throw "Can't unzip";
                }
                console.log('unzip =', unZiped)
                // console.log('delete zipFilePath = ', zipFilePath, await deleteFile(zipFilePath))
                break;
        }

        console.log('websitePath = ',websitePath)
        const websiteAbsPath = path.resolve(websitePath);

        let htmlPath = ``;

        indexAllowedTypes.forEach(indexAllowedType => {
            if (htmlPath !== '') {
                return;
            }
            const tempPath = `${websiteAbsPath}/${indexAllowedType}`;
            if (fileExists(tempPath)) {
                htmlPath = tempPath;
            }
        })
        console.log('htmlPath = ',htmlPath)

        const htmlString = fs.readFileSync(htmlPath);

        // const htmlparser2 = require('htmlparser2');
        // const dom = htmlparser2.parseDOM(htmlString, {
        //     xml: {
        //         withDomLvl1: true,
        //         normalizeWhitespace: false,
        //         xmlMode: true,
        //         decodeEntities: true
        //     }
        // });
        console.log('Cheerio load before');
        let $ = cheerio.load(htmlString, { decodeEntities: false });
        console.log('Cheerio load after');

        await imagesDirRename($, websiteAbsPath);
        console.log('imagesDirRename function done')

        // img alt=""
        addImgAlts($)

        // href value => {offer}
        hrefToOffer($)

        // remove Favicons/Manifest/Author/
        removeMetaInfo($)

        const {nameReplacements} = options;
        if (!!nameReplacements.length) {
            const newHTML = await productRename($, nameReplacements);
            if( !newHTML ){
                throw "Something went wrong after product renaming."
                return;
            }
            $ = cheerio.load(newHTML, { decodeEntities: false });
        }

        toComment($, 'script', 'noscript', 'input[type="hidden"]')

        toEmptyFormTagActionAttr($);

        removeAnchorTargetAttr($);

        addJquery($)

        const {hashToken} = options;
        if (!!hashToken.length) {
            addHashToken($, hashToken);
        }

        addCountryCode($)

        console.log('Started _autoprefixer')
        console.log(path.resolve( `${websitePath}/css`));
        console.log('_autoprefixer done = ' , await _autoprefixer(path.resolve(`${websitePath}/css`), path.resolve(`${websitePath}/css`)))

        console.log('Started imgOPtimizer')
        console.log(path.resolve( `${websitePath}/img`));
        console.log('imgOptimizer done = ' , await _compressImages(
            path.resolve(`${websitePath}/img`),
            ['jpg', 'jpeg', 'JPG', 'JPEG', 'PNG'],
            path.resolve(`${websitePath}/img`))
        )

        // const imgDistPath = `${websitePath}/img_dist`
        // const distPathImgs = await getPathAllFiles(imgDistPath)
        // distPathImgs.map(async compressedImgName => {
        //     const realImgName = compressedImgName.replace('prefix_', '');
        //     const realOldImgPath = path.resolve(`${websitePath}/img/${realImgName}`);
        //
        //     console.log('delete realOldImgPath = ', realOldImgPath, await deleteFile(realOldImgPath));
        //
        //     await moveFile(`${imgDistPath}/${compressedImgName}`, realOldImgPath);
        // })
        // console.log('delete zipFilePath = ', zipFilePath, await deleteFile(zipFilePath))



        const isHtmlWroten = await writeFile(htmlPath, $.html());
        console.log('wroten a HTML = ', isHtmlWroten);

        let newZipDir = await zipDir(path.resolve(`${websitePath}/../website/`), path.resolve(`${websitePath}/../archive/exported.zip`) )
        console.log("zipDir = ", newZipDir);

        console.log('All was done');


        newZipDir = newZipDir.replace( path.resolve(), config.get('baseRealUrl') )

        await notify(589781832, `newZipDir = ${newZipDir}` );

        console.log('newZipDir = ', newZipDir)
        return resolve(newZipDir)
    }catch (e) {
        log(e);
        resolve(false)
    }
})


module.exports = {
    addTask,
    doTask
};
// console.log(gulp.start(
//     'resize'
// ))
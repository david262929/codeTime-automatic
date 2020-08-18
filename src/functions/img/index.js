const gulp = require('gulp');
const webp = require('gulp-webp');
const plumber = require('gulp-plumber');
const tinypng = require('gulp-tinypng-extended');
const responsive = require('gulp-responsive');
const path = require('path');
const fs = require('fs');
const sizeOf = require('image-size');
const imagemin = require('gulp-imagemin');
const imageminGuetzli = require('imagemin-guetzli');
const imageminMozjpeg = require('imagemin-mozjpeg');
const autoprefixer = require('autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const postcss = require('gulp-postcss')
const {log, deleteFile, getPathAllFiles} = require('../automatic.functions');
const {compress} = require('compress-images/promise');
const moveFile = require('move-file');

const _webp = async (imagesPattern = './img/*.{png,jpg,jpeg,JPG,JPEG}', exportDir = './img/') => new Promise(resolve => {
    const stream = gulp.src(imagesPattern)
        .pipe(webp({
            quality: 80,
            preset: 'photo',
            method: 6
        }))
        .pipe(gulp.dest(exportDir))

    stream.on('end', () => {

        resolve(true)
    });
    stream.on('error', (err) => {
        if (err) {
            log(err);
            throw err;
        }
        resolve(false)
    });
})

const _compressImages = async (
    imagesPath = './img',
    extentions = ['png', 'jpg', 'jpeg', 'JPG', 'JPEG'],
    exportDir = './img'
) => new Promise(async resolve => {
    const result = await compress({
        source: `${imagesPath}/*.{${extentions.join(',')}}`,
        destination: exportDir,
        enginesSetup: {
            jpg: {engine: "mozjpeg", command: ["-quality", "60"]},
            png: {engine: "pngquant", command: ["--quality=20-50"]},
            svg: {engine: "svgo", command: "--multipass"},
            gif: {engine: "gifsicle", command: ["--colors", "64", "--use-col=web"]}
        },
    })

    // {compress_force: false, statistic: true, autoupdate: true},
    const {statistics, errors, completed} = result;
    console.log({statistics, errors, completed});

    if (errors.length) {
        log(errors);
    }

    resolve(!!errors.length)
})

const _resizeWIthWidth = async (directoryPath = './img') => new Promise(resolve => {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        const x = 0;
        files.forEach(file => {
            let file_name, file_extension, file_fullname;
            file_fullname = file;
            file_name = file.split('.');
            file_extension = file.split('.');
            file_extension = file_extension[file_extension.length - 1];
            file_name.pop();
            file_name = file_name.join('');

            sizeOf('img/' + file_fullname, (err, dimensions) => {
                let sizeArr = [];
                if (dimensions.width === 600) {
                    sizeArr = [
                        {
                            width: 450,
                            rename: file_name + '-450.' + file_extension
                        }
                    ]
                }
                if (dimensions.width > 600 && dimensions.width < 700) {
                    sizeArr = [
                        {
                            width: 500,
                            rename: file_name + '-500.' + file_extension
                        }
                    ]
                }
                if (dimensions.width >= 700 && dimensions.width < 800) {
                    sizeArr = [
                        {
                            width: 500,
                            rename: file_name + '-500.' + file_extension
                        }, {
                            width: 600,
                            rename: file_name + '-600.' + file_extension
                        }
                    ]
                }
                if (dimensions.width >= 800 && dimensions.width < 1000) {
                    sizeArr = [
                        {
                            width: 500,
                            rename: file_name + '-500.' + file_extension
                        }, {
                            width: 600,
                            rename: file_name + '-600.' + file_extension
                        }, {
                            width: 700,
                            rename: file_name + '-700.' + file_extension
                        }
                    ]
                }
                if (dimensions.width > 1000) {
                    sizeArr = [
                        {
                            width: 500,
                            rename: file_name + '-500.' + file_extension
                        }, {
                            width: 600,
                            rename: file_name + '-600.' + file_extension
                        }, {
                            width: 700,
                            rename: file_name + '-700.' + file_extension
                        }, {
                            width: 800,
                            rename: file_name + '-800.' + file_extension
                        }
                    ]
                }
                const stream = gulp.src('./img/' + file_fullname)
                    .pipe(responsive({
                        file_fullname: sizeArr,
                        errorOnUnusedImage: false,
                    }))
                    .pipe(gulp.dest('./img/'));

                stream.on('end', () => {

                    resolve(true)
                });
                stream.on('error', (err) => {
                    if (err) {
                        log(err);
                        throw err;
                    }
                    resolve(false)
                });
            })
        });
    });
});


const _guetzli = async (
    imagesPath = './img',
    extentions = ['png', 'jpg', 'jpeg', 'JPG', 'JPEG'],
    exportDir = './img'
) => new Promise(resolve => {

    const stream = gulp.src(`${imagesPath}/*.{${extentions.join(',')}}`)
        .pipe(imagemin([
            imageminGuetzli({
                quality: 85
            })
        ]))
        .pipe(gulp.dest(exportDir));

    stream.on('end', () => {
        resolve(true)
    });
    stream.on('error', (err) => {
        if (err) {
            log(err);
            throw err;
        }
        resolve(false)
    });

})


const _mozjpeg = async () => new Promise(resolve => {
    const stream = gulp.src('./img/*.{png,jpg,jpeg,JPG,JPEG}')
        .pipe(imagemin([imageminMozjpeg({
            quality: 85
        })]))
        .pipe(gulp.dest('./img'));
    stream.on('end', () => {

        resolve(true)
    });
    stream.on('error', (err) => {
        if (err) {
            log(err);
            throw err;
        }
        resolve(false)
    });
})

const _images = async () => new Promise(resolve => {
    const stream = gulp.src('./img/*.{png,jpg,jpeg,JPG,JPEG}')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./img'))
    stream.on('end', () => {

        resolve(true)
    });
    stream.on('error', (err) => {
        if (err) {
            log(err);
            throw err;
        }
        resolve(false)
    });
})


// Компресия изображений
const _tinypng = async (imagesPattern = './img/*.{png,jpg,jpeg,JPG,JPEG}', exportDir = './img/') => new Promise(resolve => {
    const stream = gulp.src(imagesPattern)
        .pipe(plumber())
        .pipe(tinypng({
            key: '11lwgLRBgvS4Z1K4mcY6Q6sT96bX6Lxw',
            sigFile: './img/.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest(exportDir));

    stream.on('end', () => {

        resolve(true)
    });
    stream.on('error', (err) => {
        if (err) {
            log(err);
            throw err;
        }
        resolve(false)
    });
})


const _resize = async (
    imagePath = './img',
    imageName = 'original',
    imageExtention = 'jpg',
    exportDir = './img/'
) => new Promise(resolve => {
    const key = `${imageName}.${imageExtention}`;
    const stream = gulp.src(`${imagePath}/${imageName}.${imageExtention}`, {allowEmpty: true}).pipe(responsive({
        [key]: [
            // {
            //     width: 800,
            //     rename: 'gipert@800px.jpg'
            // }
            // ,
            // {
            //     width: 700,
            //     rename: 'imagetop@700px.jpg'
            // },
            {
                width: 600,
                rename: `${imageName}@600px.${imageExtention}`
            },
            {
                width: 500,
                rename: `${imageName}@500px.${imageExtention}`
            }
        ]
    })).pipe(gulp.dest(exportDir))

    stream.on('end', () => {

        resolve(true)
    });
    stream.on('error', (err) => {
        if (err) {
            log(err);
            throw err;
        }
        resolve(false)
    });
})

const moveFilesFromDirOnReplaceMode = (fromDir, toDir) => new Promise(async resolve => {
    const distPathFiles = await getPathAllFiles(fromDir);

    if (!distPathFiles.length) {
        resolve(true);
    }

    distPathFiles.map(async (compressedFileName, index) => {
        const realOldFilePath = path.resolve(`${toDir}/${compressedFileName}`);

        console.log('delete realOldFIlePath = ', realOldFilePath, await deleteFile(realOldFilePath));

        console.log('new File Moves realOldFIlePath = ', await moveFile(`${fromDir}/${compressedFileName}`, realOldFilePath));

        if (index === distPathFiles.length) {
            resolve(true);
        }
    })
})

const _autoprefixer = async (cssPath = './css', exportPath = './css') => new Promise(resolve => {
    const tempExportPath = exportPath + '/css_minified'
    const stream = gulp.src(`${cssPath}/*.css`)
        // .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer()]))
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(tempExportPath))

    stream.on('end', async () => {
        await moveFilesFromDirOnReplaceMode( tempExportPath, cssPath )
    });
    stream.on('error', (err) => {
        if (err) {
            log(err);
            throw err;
        }
        resolve(false)
    });
})

module.exports = {
    _webp,
    _resizeWIthWidth,
    _guetzli,
    _mozjpeg,
    _images,
    _tinypng,
    _resize,
    _autoprefixer,
    _compressImages,
}
const gulp = require('gulp');
const webp = require('gulp-webp');
const plumber = require('gulp-plumber');
const tinypng = require('gulp-tinypng-extended');
const responsive = require('gulp-responsive');
const path = require('path');
const fs = require('fs');
const sizeOf = require('image-size');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

const _webp = () => gulp.src('./img/*.{jpg,jpeg,JPG,JPEG}')
    .pipe(webp({
        quality: 80,
        preset: 'photo',
        method: 6
    }))
    .pipe(gulp.dest('./img'))



const _resizeWIthWidth = (done) => {
    const directoryPath = path.join('./', 'img');

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        const x = 0;
        files.forEach(function (file) {
            let file_name, file_extension, file_fullname;
            file_fullname = file;
            file_name = file.split('.');
            file_extension = file.split('.');
            file_extension = file_extension[file_extension.length - 1];
            file_name.pop();
            file_name = file_name.join('');

            sizeOf('img/' + file_fullname, function (err, dimensions) {
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
                return gulp.src('./img/' + file_fullname)
                    .pipe(responsive({
                        file_fullname: sizeArr,
                        errorOnUnusedImage: false,
                    }))
                    .pipe(gulp.dest('./img/'));
            });
        });
    });
}


const _guetzli = () => gulp.src('./img/*.{png,jpg,jpeg,JPG,JPEG}')
    .pipe(imagemin([
        imageminGuetzli({
            quality: 85
        })
    ]))
    .pipe(gulp.dest('./img'))



const _mozjpeg = () => gulp.src('./img/*.{png,jpg,jpeg,JPG,JPEG}')
    .pipe(imagemin([imageminMozjpeg({
        quality: 85
    })]))
    .pipe(gulp.dest('./img'));

const _images = () => gulp.src('./img/*.{png,jpg,jpeg,JPG,JPEG}')
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(gulp.dest('./img'))


// Компресия изображений
const _tinypng = () => gulp.src('./img/*.{png,jpg,jpeg,JPG,JPEG}')
    .pipe(plumber())
    .pipe(tinypng({
        key: '11lwgLRBgvS4Z1K4mcY6Q6sT96bX6Lxw',
        sigFile: './img/.tinypng-sigs',
        log: true
    }))
    .pipe(gulp.dest('./img/'))


const _resize = () => gulp.src('./img/original.jpg', {allowEmpty: true})
    .pipe(responsive({
        'original.jpg': [
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
                rename: 'orignal@600px.jpg'
            },
            {
                width: 500,
                rename: 'orignal@500px.jpg'
            }
        ]
    }))
    .pipe(gulp.dest('./img-resized/'))

module.exports = {
    _webp,
    _resizeWIthWidth,
    _guetzli,
    _mozjpeg,
    _images,
    _tinypng,
    _resize,
}
const gulp = require('gulp');
const concatCss = require('gulp-concat-css');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const gulpuncss = require('gulp-uncss');



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
};
// console.log(gulp.start(
//     'resize'
// ))
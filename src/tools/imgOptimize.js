const log = require('../functions/logger');

const imagemin = require("imagemin")
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const imageminGifsicle = require("imagemin-gifsicle");
const imageminSvgo = require("imagemin-svgo");
const imageminOptipng = require("imagemin-optipng");
const imageminGuetzli = require('imagemin-guetzli');

module.exports = async ( inputFilesPatterns = 'original-images/*.{jpg,png,ico}', outputFilesDir = 'original-images') => {
    // Optimize the image size
    if( !Array.isArray(inputFilesPatterns) ){
        inputFilesPatterns = [inputFilesPatterns]
    }

    try {
        const files = await imagemin(inputFilesPatterns, {
            destination: outputFilesDir,
            plugins: [
                imageminGifsicle(),
                imageminJpegtran(),
                imageminOptipng(),
                imageminPngquant(),
                imageminSvgo(),
                imageminGuetzli({quality: 84}),
            ]
        })
        return files.length
    }catch (err) {
        console.log(err)
        log( JSON.stringify(err), null, 'system_error', 'error' );
        return false;
    }
}
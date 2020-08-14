const { parse } = require('node-html-parser');
const root = parse('<ul id="list"><li>Hello World</li></ul>');

// console.log(fs.readFileSync('temp.txt', 'utf8'));

console.log(root.firstChild.structure);
// ul#list
//   li
//     #text

console.log(root.querySelector('#list'));
root.appendChild(`<srcipt src="aaaaaaaaa"></srcipt>`)
// { tagName: 'ul',
//   rawAttrs: 'id="list"',
//   childNodes:
//    [ { tagName: 'li',
//        rawAttrs: '',
//        childNodes: [Object],
//        classNames: [] } ],
//   id: 'list',
//   classNames: [] }
// <ul id="list"><li>Hello World</li></ul>
// root.set_content('<li>Hello World</li>');
console.log(root.toString());

//
// (async () => {
//     const validator = require('html-validator')
//     const options = {
//         data: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//         <title>Dassasas</title>
//         </head>
//         <body>
//         aaaaaaa
//         </body>
//         </html>`,
//         format: 'html'
//     }
//
//     try {
//         const result = await validator(options)
//         console.log( result )
//     } catch (error) {
//         console.error(error)
//     }
// })()
//
// const gulp = require('gulp');
// const validator = require('gulp-html');
//
// const html = () => {
//     return gulp.src('uploads/projects/david262929-1597342222561/website/inde.html')
//         .pipe(validator())
//         .pipe(gulp.dest('uploads/projects/david262929-1597342222561/dist/'));
// };
// html();
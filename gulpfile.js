const {src, dest, series, watch, parallel} = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const htmlReplace = require('gulp-html-replace');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync');
const eslint = require('gulp-eslint');

function browserSync() {
  return browsersync.init({
    server: {
      baseDir: './dist',
    },
    port: 3456,
  })
};

function htmlTask() {
  return src('src/*.html')
  .pipe(dest('dist/'))
  .pipe(browsersync.stream());
}

function styleTask(){
  return src('src/css/*.css')
  .pipe(sourcemaps.init())
  .pipe(autoprefixer())
  .pipe(cleanCSS())
  .pipe(sourcemaps.write())
  .pipe(dest('dist/css'))
  .pipe(browsersync.stream());
}

function jsTask(){
  return src('src/js/*.js')
  // .pipe(eslint({}))
  // .pipe(eslint.format())
  // .pipe(eslint.failAfterError())
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(dest('dist/js'))
  .pipe(browsersync.stream());
}

function imagesTask(){
  return src('src/images/*')
  .pipe(imagemin())
  .pipe(dest('dist/images'))
  .pipe(browsersync.stream());

}

function watchFiles() {
  watch('src/css/*.css', styleTask);
  watch('src/script/*.js', jsTask);
  watch('*.html', htmlTask);
  watch('src/images/*', imagesTask);
}

function prefixTask() {
  return src('src/css/global.css')
  .pipe(autoprefixer())
  .pipe(dest('dist/css/'));
}

exports.html = htmlTask;
exports.style = styleTask;
exports.js = jsTask;
exports.images = imagesTask;
exports.prefix = prefixTask;
exports.watch = browserSync;

exports.dev = series(
  parallel(htmlTask, jsTask, styleTask, imagesTask),
  parallel(watchFiles, browserSync)
); 
exports.default = series(htmlTask, styleTask, jsTask, imagesTask);
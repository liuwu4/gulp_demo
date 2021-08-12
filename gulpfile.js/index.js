const gulp = require('gulp');
const connect = require('gulp-connect');
var browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const inject = require('gulp-inject');
const constant = require('./constant');
const { prefix } = require('./constant');
/**
 * 处理样式表
 * @returns
 */
function stylesheet() {
  return gulp.src(prefix('src/**/*.{css,less,sass}')).pipe(gulp.dest(prefix('dist/stylesheet')));
}
/**
 * 处理js
 * @returns
 */
function buildJs() {
  return gulp.src(prefix('src/**/*.{js,ts,tsx,jsx}')).pipe(gulp.dest(prefix('dist')));
}
/**
 * 程序入口
 * @returns
 */
function entry() {
  const source = gulp.src([prefix('dist/**/*.{js,ts,tsx}'), prefix('dist/**/*.{css,less}')], { read: false });
  browserSync.watch(prefix('index.html')).on('change', browserSync.reload);
  browserSync.watch(prefix('dist/**/*.css')).on('change', browserSync.reload);
  browserSync.watch(prefix('dist/**/*.js')).on('change', browserSync.reload);
  return gulp
    .src(prefix('index.html'))
    .pipe(inject(source, { relative: false }))
    .pipe(gulp.dest(prefix('dist')));
}
/**
 * 启动服务器
 */
function server(done) {
  browserSync.init({
    open: false,
    ui: false,
    notify: false,
    server: {
      baseDir: './',
    },
  });
  done();
}
/**
 * 监听文件变化
 */
function watchFile() {
  watch([prefix('src/**/*.{js,ts}')], ['add'], function () {
    buildJs();
  });
  watch([prefix('src/**/*.{css,less,sass}')], ['add'], function () {
    stylesheet();
  });
}

exports.start = gulp.series(buildJs, stylesheet, entry, server, watchFile);

const gulp = require('gulp');
var browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const inject = require('gulp-inject');
const babel = require('gulp-babel');
const less = require('gulp-less');
const path = require('path');
const revCollector = require('gulp-rev-collector');
const rev = require('gulp-rev');
const { prefix } = require('./constant');
const { builds } = require('./docs');
/**
 * 处理样式表
 * @returns
 */
function stylesheet() {
  return gulp
    .src(prefix('src/**/*.{css,less,sass}'))
    .pipe(less())
    .pipe(rev())
    .pipe(gulp.dest(prefix('dist/stylesheet')))
    .pipe(rev.manifest())
    .pipe(gulp.dest(prefix('dist/rev')));
}
/**
 * 处理js
 * @returns
 */
function buildJs() {
  return gulp
    .src(prefix('src/**/*.{js,ts,tsx,jsx}'))
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(rev())
    .pipe(gulp.dest(prefix('dist/js')))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/rev'));
}
/**
 * 程序入口
 * @returns
 */
function entry() {
  const source = gulp.src([prefix('dist/**/*.{js,ts,tsx}'), prefix('dist/**/*.css')], { read: false });
  browserSync.watch(prefix('index.html')).on('change', browserSync.reload);
  browserSync.watch(prefix('dist/**/*.css')).on('change', browserSync.reload);
  browserSync.watch(prefix('dist/**/*.js')).on('change', browserSync.reload);
  return gulp
    .src([prefix('index.html')])
    .pipe(
      inject(source, {
        relative: true,
        transform: function (filePath, file) {
          const ext = path.extname(filePath);
          if (ext === '.js') {
            return `<script src="${filePath.replace('dist', '')}"></script>`;
          }
          if (ext === '.css') {
            return `<link href="${filePath.replace('dist', '')}" rel="stylesheet">`;
          }
        },
      })
    )
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
      baseDir: './dist',
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

const start = gulp.series(buildJs, stylesheet, entry, server, watchFile);

module.exports = {
  build: gulp.series(buildJs, stylesheet),
  buildJs,
  stylesheet,
  entry,
  server,
  docs: builds,
  start,
};

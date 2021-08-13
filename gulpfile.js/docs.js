const { prefix } = require('./constant');
const gulp = require('gulp');
const markdonw = require('gulp-markdown');

function build() {
  return gulp
    .src(prefix('src/**/*.doc.md'))
    .pipe(markdonw())
    .pipe(gulp.dest(prefix('dist/docs')));
}
exports.builds = build;

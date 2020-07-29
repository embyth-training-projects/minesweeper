'use strict';

var gulp = require('gulp');
var newer = require('gulp-newer');
var zip = require('gulp-zip');
var del = require('del');
var browserSync = require('browser-sync').create('Local Server');

gulp.task('copy', function () {
  return gulp.src(['css/**/*', 'fonts/**/*', 'img/**/*', 'js/**/*', '*.html', 'favicon.ico'], {
      base: '.'
    })
    .pipe(newer('./build/'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('clean', function () {
  return del('./build/');
});

gulp.task('server', function (done) {
  browserSync.init({
    server: {
      baseDir: './build/'
    },
    notify: false,
    open: true,
    cors: true,
    ui: false,
    reloadOnRestart: true,
  });

  done();
});

gulp.task('watch', function () {
  gulp.watch('./**/*').on('all', gulp.series('copy', browserSync.reload));
});

gulp.task('build', gulp.series('clean', gulp.parallel('copy')));

gulp.task('default', gulp.series('build', 'server', 'watch'));

// Archiving project
const leadingZero = number => number < 10 ? `0${number}` : number;

const getDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = leadingZero(now.getMonth() + 1);
  const day = leadingZero(now.getDate());
  const hours = leadingZero(now.getHours());
  const minutes = leadingZero(now.getMinutes());
  const seconds = leadingZero(now.getSeconds());

  return `${year}-${month}-${day}-${hours}${minutes}${seconds}`;
};

gulp.task('zip', function () {
  let dateTime = getDateTime();
  let fileName = `dist-${dateTime}.zip`;

  return gulp.src('./build/**/*.*')
    .pipe(zip(fileName))
    .pipe(gulp.dest('./dist'));
});

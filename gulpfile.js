var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-cssnano');
var rename = require('gulp-rename');
var sh = require('shelljs');
var jade = require('gulp-jade');
var clean = require('gulp-rimraf');

var paths = {
  jadeIndex: ['./views/*.jade'],
  jadePartials: ['./views/partials/*.jade'],
  jadeTemplates: ['./views/templates/*.jade'],
  scripts: ['./public/javascripts/**/*.js'],
  styles: ['./public/stylesheets/*.css', '!./public/*'],
  images: ['./public/stylesheets/images/*.png',
    './public/stylesheets/images/*.jpg',
    './public/stylesheets/images/*.gif', '!./public/*']
};

handleError = function(err) {
  console.log("handleError function called")
  console.log(err.toString());
  this.emit('end');
};

gulp.task('clean', [], function() {
  console.log("Clean all files in www/js folder");

  return gulp.src("www/js/*", { read: false }).pipe(clean());
});

gulp.task('default', ['jade-ndx', 'jade-tmplt', 'jade-ptn', 'jscopy', 'csscopy', 'imgcopy']);


gulp.task('jade-ndx', function (done) {
    var YOUR_LOCALS;
    YOUR_LOCALS = {};
    console.log("Grab Jade Index file from ");
    console.log(paths.jadeIndex);
    gulp.src(paths.jadeIndex).pipe(jade ({
        locals: YOUR_LOCALS
    }).on('error', handleError)).pipe(gulp.dest('www')).on('end', done);
});

gulp.task('jade-tmplt', function (done) {
    var YOUR_LOCALS;
    YOUR_LOCALS = {};
    console.log("Grab Jade Template files from ");
    console.log(paths.jadeTemplates);
    gulp.src(paths.jadeTemplates).pipe(jade ({
        locals: YOUR_LOCALS
    }).on('error', handleError)).pipe(gulp.dest('www/templates')).on('end', done);
});

gulp.task('jade-ptn', function (done) {
    var YOUR_LOCALS;
    YOUR_LOCALS = {};
    console.log("Grab Jade Partition files from ");
    console.log(paths.jadePartials);
    gulp.src(paths.jadeTemplates).pipe(jade ({
        locals: YOUR_LOCALS
    }).on('error', handleError)).pipe(gulp.dest('www/partials')).on('end', done);
});

gulp.task('jscopy', function () {
    return gulp.src(paths.scripts, {
        cwd: './'
    }).on('error', handleError).pipe(gulp.dest('www/js'));
});

gulp.task('csscopy', function () {
    return gulp.src(paths.styles, {
        cwd: './'
    }).on('error', handleError).pipe(gulp.dest('www/css'));
});

gulp.task('imgcopy', function () {
    return gulp.src(paths.images, {
        cwd: './'
    }).on('error', handleError).pipe(gulp.dest('www/css/images'));
});


gulp.task('watch', function () {
    gulp.watch(paths.jade, ['jade-ndx', 'jade-tmplt', 'jade-ptn']);
    gulp.watch(paths.scripts, ['jscopy']);
    gulp.watch(paths.styles, ['csscopy']);
    gulp.watch(paths.images, ['imgcopy']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

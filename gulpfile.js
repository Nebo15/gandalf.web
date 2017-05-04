var gulp = require('gulp'),
  fs = require('fs'),
  sequence = require('gulp-sequence'),
  path = require('path'),
  argv = require('yargs').argv,
  prefix = require('gulp-prefix'),
  clean = require('gulp-clean'),
  browserSync = require('browser-sync'),
  compass = require('gulp-compass'),
  autoprefixer = require('gulp-autoprefixer'),
  jade = require('gulp-jade'),
  notify = require("gulp-notify"),
  plumber = require('gulp-plumber'),
  ghPages = require('gulp-gh-pages'),
  gulpif = require('gulp-if'),
  replace = require('gulp-replace'),
  rename = require('gulp-rename'),
  l10n = require('gulp-l10n'),

  ngAnnotate = require('gulp-ng-annotate'),

  useref = require('gulp-useref'),
  uglify = require('gulp-uglify'),
  htmlmin = require('gulp-htmlmin'),
  minifyCss = require('gulp-minify-css'),
  _ = require('lodash'),
  ngConstant = require('gulp-ng-constant'),
  gutil = require('gulp-util'),
  stream = require('stream'),
  nodemon = require('gulp-nodemon'),

  protractor = require('gulp-protractor');

var webdriver_standalone = protractor.webdriver_standalone;


var src = {
  jade: ['src/jade/*.jade','src/jade/templates/**/*.jade'],
  html: ['www/*.html','www/templates/**/*.html']
};

//the title and icon that will be used for the Grunt notifications
var notifyInfo = {
  title: 'Gulp'
  //icon: path.join(__dirname, 'gulp.png')
};

//error notification settings for plumber
var plumberErrorHandler = {
  errorHandler: notify.onError({
    title: notifyInfo.title,
    //icon: notifyInfo.icon,
    message: "Error: <%= error.message %>"
  })
};

// Clean temporary folders
gulp.task('clean', function () {
  return gulp.src(['./www', './.sass-cache'], {read: false})
    .pipe(clean());
});

// SASS to CSS
gulp.task('build-styles', function () {
  return gulp.src('./src/sass/*.{sass,scss}', {base: './'})
    .pipe(plumber(plumberErrorHandler))
    .pipe(compass({
      config_file: './config.rb',
      project: path.join(__dirname, ''),
      http_images_path: '/images',
      generated_images_path: 'www/images',
      http_path: '/',
      css: 'www/css',
      sass: 'src/sass',
      image: 'src/images',
      debug: !argv.production,
      relative: true,
      style: argv.production ? 'compressed' : 'nested'
    }))
    .pipe(autoprefixer({
      browsers: ['last 4 versions', 'ie 8'],
      cascade: false
    }))
    .pipe(gulp.dest('./www/css'));
});


// SVG to SVG sprites
gulp.task('copy-images', function () {
  return gulp.src(['./src/images/**/*', '!./src/images/icons/**/*'], {base: './src'})
    .pipe(gulp.dest('./www'));
});

// Static files
gulp.task('copy-statics', ['build-jade'], function () {
  return gulp.src(['./src/static/**/*'], {base: './src/static'})
    .pipe(gulp.dest('./www'));
});

// Scripts
gulp.task('copy-scripts', function () {
  return gulp.src(['./src/js/**/*'], {base: './src'})
    .pipe(gulp.dest('./www'));
});

// Bower
gulp.task('copy-bower', function () {
  return gulp.src(['./src/bower_components/**/*'], {base: './src'})
    .pipe(gulp.dest('./www'));
});

// Fonts
gulp.task('copy-fonts', function () {
  return gulp.src(['./src/fonts/**/*'], {base: './src'})
    .pipe(gulp.dest('./www'));
});


// Jade to HTML
gulp.task('build-jade', function () {
  return gulp.src(src.jade, {base: './src/jade'})
    .pipe(plumber(plumberErrorHandler))
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('www'));
});


function string_src (filename, string) {
  var src = stream.Readable({ objectMode: true });
  src._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }));
    this.push(null)
  };
  return src
}

gulp.task('minimize', function (cb) {
  if (!argv.production) {
    return cb();
  }

  return gulp.src(['www/*.html', 'www/templates/*.html'], {base: 'www'})
    .pipe(useref())
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulpif('*.js', ngAnnotate()))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true, removeComments: true})))
    .pipe(gulp.dest('www'));
});

var l10nOpts = {
  elements: [],
  native: 'origin.tmp',
  base: 'en',
  enforce: argv.production ? 'strict' : 'warn'
};

gulp.task('extract-locales', ['build-jade','copy-statics'], function () {
  return gulp.src('www/**/*.html')
    .pipe(l10n.extract({
      elements: l10nOpts.elements,
      native: l10nOpts.native
    }))
    .pipe(gulp.dest('locales'));
});

gulp.task('load-locales', function () {
  return gulp.src('locales/*.json')
    .pipe(l10n.setLocales({
      native: l10nOpts.native,
      enforce: l10nOpts.enforce
    }));
});

// Files piped to the plugin are localized and cloned to a separate subdirectory
// for each locale. e.g.: 'index.html' > 'de/index.html'

gulp.task('localize', ['build-jade', 'copy-statics', 'load-locales'], function () {
  return gulp.src('www/{./,templates}/*.html')
    .pipe(l10n())
    //.pipe(replace(/s18n(-attrs)?(=[\"\'][^\'^\"]*[\"\'])?/g, ''))
    //.pipe(gulpif('**/'+l10nOpts.base+'/**/**.*', rename(function (path) {
    //  path.dirname = path.dirname.replace(l10nOpts.base + '/', '').replace(l10nOpts.base, '');
    //})))
    .pipe(gulp.dest('www'))
});

// Watch for for changes
gulp.task('watch', function () {
  gulp.watch('./src/sass/**/*', ['build-styles']);
  gulp.watch('./src/images/**/*', ['copy-images', 'build-styles']);
  gulp.watch('./src/js/**/*', ['copy-scripts']);
  gulp.watch('./src/jade/**/*', ['build-jade', 'localize']);
  gulp.watch('./src/bower_components/**/*.js', ['copy-bower']);
  gulp.watch('./src/static/**/*', ['copy-statics']);
  gulp.watch('./src/fonts/**/*', ['copy-fonts']);

  gulp.watch('./locales/**/*', ['localize']);
});

// Deploy gh-pages
gulp.task('deploy-prefix', ['production'], function () {
  return gulp.src('./www/**/*.html')
    .pipe(prefix('/gandalf.web'))
    .pipe(gulp.dest('./www'));
});

gulp.task('deploy', ['deploy-prefix'], function () {
  return gulp.src('./www/**/*')
    .pipe(ghPages());
});

gulp.task('server', function () {
  return nodemon({
    script: 'server',
    watch: ['server','.env'],
  });
});

// Base tasks
gulp.task('default', sequence('build', ['server', 'watch']));
gulp.task('build', function (cb) {
  sequence('clean', ['copy-bower', 'copy-fonts', 'copy-images', 'copy-statics', 'copy-scripts', 'build-styles', 'build-jade'], 'minimize')(cb);
});
gulp.task('production', function (cb) {
  argv.production = true;
  sequence('build')(cb);
});

gulp.on('err', function(e){
  process.exit(1);
});


// TESTS

gulp.task('test', function () {
  return gulp.src(['./tests/tests/*.js'])
    .pipe(protractor.protractor({
      configFile: "./protractor.config.js",
      args: ['--baseUrl', 'http://localhost:8080']
    }))
    .on('error', function (e) {
      console.error(e);
    })
    .on('end', function() {
      process.exit();
    });
});
gulp.task('test:travis', function () {
  return gulp.src(['./tests/tests/*.js'])
    .pipe(protractor.protractor({
      configFile: "./protractor.travis.js",
      args: ['--baseUrl', 'http://localhost:8080']
    }))
    .on('error', function (e) {
      console.error(e);
    })
    .on('end', function() {
      process.exit();
    });
});

gulp.task('selenium', webdriver_standalone);

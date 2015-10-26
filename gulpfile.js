var gulp         = require('gulp'),
    sequence     = require('gulp-sequence'),
    path         = require('path'),
    argv         = require('yargs').argv,
    prefix       = require('gulp-prefix'),
    clean        = require('gulp-clean'),
    browserSync  = require('browser-sync'),
    compass      = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    jade         = require('gulp-jade'),
    ghPages      = require('gulp-gh-pages');

// Web Server
gulp.task('server', function() {
    browserSync({
        server: {
            baseDir: './www',
            index: 'index.html'
        },
        files: ["www/**/*"],
        port: 8080,
        open: true,
        notify: false,
        ghostMode: false
    });
});

// Clean temporary folders
gulp.task('clean', function () {
    return gulp.src(['./www', './.sass-cache'], {read: false})
        .pipe(clean());
});

// SASS to CSS
gulp.task('build-styles', function() {
    return gulp.src('./src/css/**/*.{sass,scss}')
        .pipe(compass({
            project: path.join(__dirname, ''),
            http_images_path: '/images',
            generated_images_path: 'www/images',
            http_path: '/',
            css: 'www/css',
            sass: 'src/css',
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
gulp.task('copy-images', function() {
    return gulp.src(['./src/images/**/*', '!./src/images/icons/**/*'], {base: './src'})
        .pipe(gulp.dest('./www'));
});

// Static files
gulp.task('copy-statics', function() {
    return gulp.src(['./src/static/**/*'], {base: './src/static'})
        .pipe(gulp.dest('./www'));
});

// Scripts
gulp.task('copy-scripts', function() {
    return gulp.src(['./src/js/**/*'], {base: './src'})
        .pipe(gulp.dest('./www'));
});

// Bower
gulp.task('copy-bower', function() {
    return gulp.src(['./src/bower_components/**/*'], {base: './src'})
        .pipe(gulp.dest('./www'));
});

// Jade to HTML
gulp.task('build-jade', function() {
  return gulp.src('src/jade/*.jade')
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('www'));
});

// Watch for for changes
gulp.task('watch', function() {
    gulp.watch('./src/css/**/*', ['build-styles']);
    gulp.watch('./src/images/**/*', ['copy-images', 'build-styles']);
    gulp.watch('./src/js/**/*', ['copy-scripts']);
    gulp.watch('./src/jade/**/*', ['build-jade']);
    gulp.watch('./src/bower_components/**/*.js', ['copy-bower']);
    gulp.watch('./src/static/**/*', ['copy-statics']);
});

// Deploy gh-pages
gulp.task('deploy-prefix', function() {
  return gulp.src('./www/**/*.html')
    // .pipe(prefix('/swipe-cards'))
    .pipe(gulp.dest('./www'));
});

gulp.task('deploy', ['deploy-prefix'], function() {
  return gulp.src('./www/**/*')
    .pipe(ghPages());
});

// Base tasks
gulp.task('default', sequence('build', ['server', 'watch']));
gulp.task('build', sequence('clean', ['copy-bower','copy-images','copy-statics', 'copy-scripts', 'build-styles', 'build-jade']));

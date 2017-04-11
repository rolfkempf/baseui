'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var browserSync = require('browser-sync').create();


//compile scss files
gulp.task('scss', function () {
    gulp.src('./app/scss/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./app/css/'))
        .pipe(browserSync.stream());
});


//copy all html files to dist
gulp.task('copyhtml', ['clean'], function () {
    gulp.src('./app/**/*.html')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('copyimages', ['clean'], function () {
    gulp.src('./app/images/**/*.*')
        .pipe(gulp.dest('./dist/images/'));
});


//copy all css files to dist
gulp.task('copycss', ['clean'], function () {
    gulp.src('./app/css/styles.css')
        .pipe(gulp.dest('./dist/css/'));
});


//shrink css
gulp.task('transformcss', ['clean', 'scss', 'copycss', 'copyhtml'], function () {
    gulp.src('./dist/css/styles.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('./dist/css/', {overwrite: true}));
})

gulp.task('shrink', function () {
    gulp.src('./dist/css/styles.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('./dist/css/', {overwrite: true}))
})


//empty dist dir
gulp.task('clean', function () {
    return gulp.src('./dist/*', {read: false})
        .pipe(clean({force: true}));
});


/*
 COMMANDS / API
 */

//serve app

//default
gulp.task('default', ['build']);

//serve
gulp.task('serve', function () {
    browserSync.init({server: "./app/"});

    gulp.watch("app/scss/**/*.scss", ['scss'], browserSync.reload);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

//serve from dist
gulp.task('serve:dist', ['build'], function () {
    browserSync.init({server: "./dist/"});
});

//build
gulp.task('build', ['clean', 'scss', 'copycss', 'copyhtml', 'copyimages', 'transformcss']);

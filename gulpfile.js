/* Variables */
var gulp  = require('gulp'),
    bs = require('browser-sync').create(),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    gzip = require('gulp-gzip'),
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    rev = require('gulp-rev'),
    del = require('del'),
    ms = require('merge-stream');

/* Config */
var config = require('./gulpfile-config.json');

/* Tasks */
gulp.task('fonts', function () {
    return gulp.src(config.fonts.src)
        .pipe(gulp.dest(config.publicPath + '/' + config.fonts.dest));
});

gulp.task('styles', function () {
    return styles(config.styles.frontend);
});

gulp.task('scripts', function() {
    return scripts(config.scripts.frontend);
});

gulp.task('clean:styles', function () {
    return del([config.distPath + '/css/*']);
});

gulp.task('clean:scripts', function () {
    return del([config.distPath + '/js/*']);
});

gulp.task('clean', gulp.series(
    'clean:styles',
    'clean:scripts'
));

gulp.task('watch', function() {
    gulp.watch(config.assetsPath + '/sass/**',
        gulp.series('clean:styles', 'styles'));

    gulp.watch(config.assetsPath + '/js/**',
        gulp.series('clean:scripts', 'scripts'));
});

gulp.task('watch:bs', function() {
    bs.init({
        proxy: config.bsProxy
    });

    gulp.watch(config.assetsPath + '/sass/**',
        gulp.series('clean:styles', 'styles'))
        .on('change', bs.reload);

    gulp.watch(config.assetsPath + '/js/**',
        gulp.series('clean:scripts', 'scripts'))
        .on('change', bs.reload);

    if (config.watchHtml) {
        gulp.watch(config.watchHtml).on('change', bs.reload);
    }
});

gulp.task('default',
    gulp.series(
        'clean',
        'fonts',
        'scripts',
        'styles'
    )
);

/* Deployment tasks */
gulp.task('deploy:styles', function () {
    return deployStyles(config.styles.frontend);
});

gulp.task('deploy:scripts', function() {
    return deployScripts(config.scripts.frontend)
});

gulp.task('compress', function() {
    return ms([
        gulp.src(config.distPath + '/js/*.js')
            .pipe(gzip())
            .pipe(gulp.dest(config.distPath + '/js')),
        gulp.src(config.distPath + '/css/*.css')
            .pipe(gzip())
            .pipe(gulp.dest(config.distPath + '/css'))
    ]);
});

gulp.task('deploy',
    gulp.series(
        'clean',
        'fonts',
        'deploy:scripts',
        'deploy:styles',
        'compress'
    )
);

/* Functions for styles and scripts */
function styles(conf) {
    return gulp.src(conf.src)
        .pipe(plumber(function (error) {
            console.log(error.toString());
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat(conf.dest))
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.publicPath))
        .pipe(rev.manifest({merge: true}))
        .pipe(gulp.dest('.'));
}

function scripts(conf) {
    return gulp.src(conf.src)
        .pipe(plumber(function (error) {
            console.log(error.toString());
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(concat(conf.dest))
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.publicPath))
        .pipe(rev.manifest({merge: true}))
        .pipe(gulp.dest('.'));
}

function deployStyles(conf) {
    return gulp.src(conf.src)
        .pipe(plumber(function (error) {
            console.log(error.toString());
            this.emit('end');
        }))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(concat(conf.dest))
        .pipe(uglifycss())
        .pipe(rev())
        .pipe(gulp.dest(config.publicPath))
        .pipe(rev.manifest({merge: true}))
        .pipe(gulp.dest('.'));
}

function deployScripts(conf) {
    return gulp.src(conf.src)
        .pipe(plumber(function (error) {
            console.log(error.toString());
            this.emit('end');
        }))
        .pipe(concat(conf.dest))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(config.publicPath))
        .pipe(rev.manifest({merge: true}))
        .pipe(gulp.dest('.'));
}

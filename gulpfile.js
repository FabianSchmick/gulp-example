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
    es = require('event-stream'),
    rs = require('run-sequence');

/* Config */
var config = require('./config.json'),
    assetsPath = config.assetsPath;

/* Tasks */
gulp.task('fonts', function () {
    gulp.src(config.copy.fonts.src)
        .pipe(gulp.dest(assetsPath + '/' + config.copy.fonts.dest));
});

gulp.task('styles', function () {
    return styles(config.styles.frontend);
});

gulp.task('scripts', function() {
    return scripts(config.scripts.frontend);
});

gulp.task('clean', function () {
    return del.sync(['rev-manifest.json', assetsPath + '/min/css/*', assetsPath + '/min/js/*']);
});

gulp.task('watch', function() {
    bs.init({
        proxy: config.bsProxy
    });

    gulp.watch(assetsPath + '/sass/**', function () {
        rs(
            'clean',
            'styles',
            'scripts'
        )
    })
    .on('change', bs.reload);

    gulp.watch(assetsPath + '/js/**', function () {
        rs(
            'clean',
            'styles',
            'scripts'
        )
    })
    .on('change', bs.reload);

    if (config.watchHtml) {
        gulp.watch(config.watchHtml).on('change', bs.reload);
    }
});

gulp.task('default',
    function () {
        rs(
            'clean',
            'fonts',
            'styles',
            'scripts'
        )
    }
);

/* Deployment tasks */
gulp.task('deployStyles', function () {
    return deployStyles(config.styles.frontend);
});

gulp.task('deployScripts', function() {
    return deployScripts(config.scripts.frontend)
});

gulp.task('compress', function() {
    gulp.src(assetsPath + '/min/js/*.js')
        .pipe(gzip())
        .pipe(gulp.dest(assetsPath + '/min/js'));
    gulp.src(assetsPath + '/min/css/*.css')
        .pipe(gzip())
        .pipe(gulp.dest(assetsPath + '/min/css'));
});

gulp.task('deploy',
    function () {
        rs(
            'clean',
            'fonts',
            'deployStyles',
            'deployScripts',
            'compress'
        );
    }
);

/* Functions for styles and scripts */
function styles(conf) {
    return es.concat(
        gulp.src(conf.src)
        .pipe(plumber(function (error) {
            console.log(error.toString());
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
    )
    .pipe(concat(conf.dest))
    .pipe(rev())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(assetsPath))
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
    .pipe(gulp.dest(assetsPath))
    .pipe(rev.manifest({merge: true}))
    .pipe(gulp.dest('.'));
}

function deployStyles(conf) {
    return es.concat(
        gulp.src(conf.src)
        .pipe(plumber(function (error) {
            console.log(error.toString());
            this.emit('end');
        }))
        .pipe(sass())
        .pipe(autoprefixer())
    )
    .pipe(concat(conf.dest))
    .pipe(uglifycss())
    .pipe(rev())
    .pipe(gulp.dest(assetsPath))
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
    .pipe(gulp.dest(assetsPath))
    .pipe(rev.manifest({merge: true}))
    .pipe(gulp.dest('.'));
}

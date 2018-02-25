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
var assetsPath = './web/assets',    // path of your assets
    bsProxy = '127.0.0.1',          // ip or domain for browsersync to find your project
    watchHtml = './web/*.php';      // watch additional files for changes

var copy = {
    fonts: {
        src: [
            './node_modules/font-awesome/fonts/*'
        ],
        dest: assetsPath + '/min/fonts/'
    }
};

var stylesConf = {
    frontend: {
        src: [
            './node_modules/font-awesome/css/font-awesome.min.css',
            './node_modules/bootstrap/dist/css/bootstrap.min.css',
            assetsPath + '/sass/default.sass'
        ],
        concatName: 'min/css/main.css'
    }
};

var scriptsConf = {
    frontend: {
        src: [
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/bootstrap/dist/js/bootstrap.min.js',
            assetsPath + '/js/default.js'
        ],
        concatName: 'min/js/main.js'
    }
};

/* Tasks */
gulp.task('fonts', function () {
    gulp.src(copy.fonts.src)
        .pipe(gulp.dest(copy.fonts.dest));
});

gulp.task('styles', function () {
    return styles(stylesConf.frontend);
});

gulp.task('scripts', function() {
    return scripts(scriptsConf.frontend)
});

gulp.task('clean', function () {
    return del.sync(['rev-manifest.json', assetsPath + '/min/css/*', assetsPath + '/min/js/*']);
});

gulp.task('watch', function() {
    bs.init({
        proxy: bsProxy
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

    if (watchHtml) {
        gulp.watch(watchHtml).on('change', bs.reload);
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
    return deployStyles(stylesConf.frontend);
});

gulp.task('deployScripts', function() {
    return deployScripts(scriptsConf.frontend)
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
    .pipe(concat(conf.concatName))
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
    .pipe(concat(conf.concatName))
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
    .pipe(concat(conf.concatName))
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
    .pipe(concat(conf.concatName))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest(assetsPath))
    .pipe(rev.manifest({merge: true}))
    .pipe(gulp.dest('.'));
}

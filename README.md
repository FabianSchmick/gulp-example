Gulp example
===========

This example is a skeleton for projects which use gulp 

The example provides you following functionality:
- Common npm packages ([jQuery](https://www.npmjs.com/package/jquery), [Bootstrap](https://www.npmjs.com/package/bootstrap), [Font-Awesome](https://www.npmjs.com/package/font-awesome))
- Sass compiler with [gulp-sass](https://www.npmjs.com/package/gulp-sass)
- Automatic vendor prefixer with [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)
- Uglify css and js with [gulp-uglifycss](https://www.npmjs.com/package/gulp-uglifycss) and [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)
- Gzip with [gulp-gzip](https://www.npmjs.com/package/gulp-gzip)
- Static asset revisioning by appending content hash to filenames with [gulp-rev](https://github.com/sindresorhus/gulp-rev)
- Sourcemaps with gulp built-in support
- Browser refreshing with [browser-sync](https://www.npmjs.com/package/browser-sync)


## Installation

Clone the project
```
git clone https://github.com/FabianSchmick/gulp-example.git
```

## Usage

Configure your npm packages and gulpfile-config to your preferences

### While you develop
Use the gulp watch task ``gulp watch`` to compile and concat your assets or use ``gulp watch:bs`` if you want to refresh your browser automatically on change (open ``localhost:3000``).

### In production
Run ``gulp deploy`` to minify, prefix and gzip your assets

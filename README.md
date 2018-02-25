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
- Sourcemaps with [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)
- Browser refreshing with [browser-sync](https://www.npmjs.com/package/browser-sync)


## Installation

Clone the project
```
git clone https://github.com/FabianSchmick/gulp-example.git
```

After you cloned you need to [setup vagrant](https://github.com/FabianSchmick/vagrant_skeleton/blob/master/README.md)

## Usage

Configure your npm packages and gulpfile to your preferences

### While you develop
 
SSH into your vagrant machine (``vagrant ssh``) and navigate to the project root ``cd /vagrant``. Here you can run the gulp watch task ``gulp watch`` 
which will compile and concat your assets and refresh your browser (open ``192.168.56.128:3000``).

### In production
Run ``gulp deploy`` to minify, prefix and gzip your assets

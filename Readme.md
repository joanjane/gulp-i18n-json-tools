# gulp-json-merger

Perform a deep merge between two json files, having a base file and an override file.

## Usage

```javascript
var gulp = require('gulp');
var jsonMerger = require('gulp-json-merger');

gulp.task('default', function () {
    return jsonMerger(
            require('./en.json'),   // base file with keys that can be overriden
            require('./es.json'),   // override file with keys to override
            'es-lang.json')         // output filename
        .pipe(gulp.dest('./i18n')); // output folder
});
```

## Installation

```shell
npm install gulp-json-merger gulp-util --save-dev
```

## Sample
Check out [this folder](https://github.com/joanjane/gulp-json-merger/tree/master/test/json) with 3 files (a.json - base, b.json - override, expected-ab.json) to see the result of merging files with this plugin.

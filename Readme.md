# gulp-json-merger

Perform a deep merge between two json files, having a base file and an override file.

## Usage:

```javascript
var gulp = require('gulp');
var jsonMerger = require('gulp-json-merger');

gulp.task('default', function () {
    var base = ;        
    var override = require('./es.json');    

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

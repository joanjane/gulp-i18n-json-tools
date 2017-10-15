# gulp-i18n-json-tools
![build](https://travis-ci.org/joanjane/gulp-i18n-json-tools.svg?branch=master)


This is a gulp 3/4 plugin that tries help on localization of projects that use json files.

Features:
1. Fill missing translations with a base language file. This plugin merges two json files in order to inherit new keys that are not translated yet on first one, so on your app will display at least, the base language instead of nothing.

2. Export json files to CSV with two columns: key, value. CSV is far more easy to work with when talking about localization, and tools like Libre Office can edit them easily. You can customize a few options of generated key, and also the delimiter of CSV.

3. Import CSV translations back to your json, updating the translated keys. When the localization team delivers you the translated resources, this tool will override your json with keys present on CSV file.


## Usage

```javascript
var gulp = require('gulp');
var i18nJsonTools = require('gulp-i18n-json-tools');

gulp.task('merge', function () {
    return i18nJsonTools.jsonMerger(
        require('./assets/en.json'),    // base file with keys that can be overriden
        require('./assets/es.json'),    // override file with keys to override
        'es.json')                      // output filename
    .pipe(gulp.dest('./assets/gen'));   // output folder
});

gulp.task('export', function () {
    return i18nJsonTools.jsonToCsv(
        require('./assets/en.json'),        // json file to export as a csv
        'en.csv')                           // output filename
        .pipe(gulp.dest('./assets/gen'));   // output folder
});
```

## Installation with dependencies

```shell
npm install gulp-i18n-json-tools gulp gulp-util papaparse --save-dev
```

## Sample
Check out [this folder](https://github.com/joanjane/gulp-i18n-json-tools/tree/master/test) to see merge/import/export folders and *result-...* files inside to get an idea of the features.

# gulp-i18n-json-tools
![build](https://travis-ci.org/joanjane/gulp-i18n-json-tools.svg?branch=master)


This is a gulp 3/4 plugin that tries help on localization of projects that use json files.

Features:
1. Fill missing translations with a base language file. This plugin merges two json files in order to inherit new keys that are not translated yet on first one, so on your app will display at least, the base language instead of nothing.

2. Export json files to CSV with two columns: key, value. CSV is far more easy to work with when talking about localization, and tools like Libre Office can edit them easily. You can customize a few options of generated key, and also the delimiter of CSV.

3. Import CSV translations back to your json, updating the translated keys. When the localization team delivers you the translated resources, this tool will override your json with keys present on CSV file.


## Usage

```javascript
var gulp = require('gulp'),
    fs = require('fs'),
    i18nJsonTools = require('gulp-i18n-json-tools');

function merge() {
    return i18nJsonTools
        .jsonMerger(
            require('./merge/en.json'),     // base language to inherit missing keys
            require('./merge/es.json'),     // language to merge with base language
            'result-es.json')               // output file name
        .pipe(gulp.dest('./merge'));        // destination folder
}

function export() {
    return i18nJsonTools
        .jsonToCsv(
            require('./export/en.json'),    // json to export to CSV
            'result-en.csv')                // output file name
        .pipe(gulp.dest('./export'));       // destination folder
}

function import() {
    return i18nJsonTools
        .updateJsonFromCsv(
            require('./import/to-fill.json'),               // target json to try to fill with csv keys
            fs.readFileSync('./import/en.csv', 'utf8'),     // csv to import
            'result-en.json')                               // output file updated with csv matched content
        .pipe(gulp.dest('./import'));                       // destination folder
}
```

## Installation with dependencies

```shell
npm install gulp-i18n-json-tools gulp vinyl papaparse --save-dev
```

## Sample
Check out [this folder](https://github.com/joanjane/gulp-i18n-json-tools/tree/master/test) to see merge/import/export folders and *result-...* files inside to get an idea of the features.

# gulp-i18n-json-tools

This is a gulp plugin that tryes help on localization of projects that use json files.

Features:
1. Fill missing translations with a base language file. This plugin merges two json files in order to inherit new keys that are not translated yet on first one, so on your app will display at least, the base language instead of nothing.

2. Export json files to CSV with two columns: key, value. CSV is far more easy to work with when talking about localization, and tools like Libre Office can edit them easily. You can customize a few options of generated key, and also the delimiter of CSV.

3. [In roadmap] Import CSV translations back to your json, updating the translated keys. When the localization team delivers you the translated resources, this tool will override your json with keys present on CSV file.

## Usage:

```javascript
var gulp = require('gulp');
var i18nJsonTools = require('gulp-i18n-json-tools');

gulp.task('merge', function () {
    var base = require('./assets/en.json');
    var override = require('./assets/es.json');
    return i18nJsonTools.jsonMerger(base, override, 'es.json')
        .pipe(gulp.dest('./assets/gen'));
});

gulp.task('export', function () {
    var base = require('./assets/en.json');
    return i18nJsonTools.jsonToCsv(base, 'en.csv')
        .pipe(gulp.dest('./assets/gen'));
});
```

## Installation with dependencies

```shell
npm install gulp-json-merger gulp gulp-util --save-dev
```

var gulpUtil = require('gulp-util'),
    gulp = require('gulp'),
    fs = require('fs'),
    i18nJsonTools = require('../index'),
    Papa = require('papaparse');

gulp.task('default', ['merge', 'export', 'import']);

gulp.task('merge', function () {
    return i18nJsonTools
        .jsonMerger(
        require('./merge/en.json'),     // base language to inherit missing keys
        require('./merge/es.json'),     // language to merge with base language
        'result-es.json')               // output file name
        .pipe(gulp.dest('./merge'));        // destination folder
});

gulp.task('export', function () {
    return i18nJsonTools
        .jsonToCsv(
        require('./export/en.json'),    // json to export to CSV
        'result-en.csv')                // output file name
        .pipe(gulp.dest('./export'));       // destination folder
});

gulp.task('import', function () {
    return i18nJsonTools
        .updateJsonFromCsv(
        require('./import/to-fill.json'),               // target json to try to fill with csv keys
        fs.readFileSync('./import/en.csv', 'utf8'),     // csv to import
        'result-en.json')                               // output file updated with csv matched content
        .pipe(gulp.dest('./import'));                       // destination folder
});

gulp.task('test', ['test:merge', 'test:export', 'test:import']);

gulp.task('test:merge', function () {
    var expected = JSON.stringify(require('./merge/expected-result-es.json'));
    var actual = JSON.stringify(require('./merge/result-es.json'));
    if (expected !== actual) {
        throw new gulpUtil.PluginError({
            plugin: 'gulp-i18n-json-tools',
            message: 'Error: Expected merge content is not equal to actual merge content'
        });
    }
});

gulp.task('test:export', function () {
    var expectedContent = fs.readFileSync('./export/expected-result-en.csv', 'utf8');
    var actualContent = fs.readFileSync('./export/result-en.csv', 'utf8');
    var expected = Papa.parse(expectedContent, { delimiter: ',' });
    var actual = Papa.parse(actualContent, { delimiter: ',' });

    expected.data.forEach((line, i) => {
        line.forEach((field, j) => {
            if (field !== actual.data[i][j]) {
                throw new gulpUtil.PluginError({
                    plugin: 'gulp-i18n-json-tools',
                    message: `Error: Expected export CSV content is not equal to actual csv content => "${field}" !== "${actual.data[i][j]}"`
                });
            }
        });
    });
});

gulp.task('test:import', function () {
    var expected = JSON.stringify(require('./import/expected-result-en.json'));
    var actual = JSON.stringify(require('./import/result-en.json'));
    if (expected !== actual) {
        throw new gulpUtil.PluginError({
            plugin: 'gulp-i18n-json-tools',
            message: 'Error: Expected import result as json from CSV is not equal to expected'
        });
    }
});

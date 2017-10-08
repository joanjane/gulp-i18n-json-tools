var gulpUtil = require('gulp-util'),
    gulp = require('gulp'),
    fs = require('fs'),
    i18nJsonTools = require('../index');

gulp.task('default', ['merge', 'export']);

gulp.task('merge', function () {
    var base = require('./assets/a.json');
    var override = require('./assets/b.json');
    return i18nJsonTools.jsonMerger(base, override, 'ab.json')
        .pipe(gulp.dest('./assets/gen'));
});

gulp.task('export', function () {
    var base = require('./assets/test-csv.json');
    return i18nJsonTools.jsonToCsv(base, 'test-csv.csv')
        .pipe(gulp.dest('./assets/gen'));
});

gulp.task('test', function () {
    var expected = JSON.stringify(require('./assets/expected-ab.json'));
    var actual = JSON.stringify(require('./assets/gen/ab.json'));
    if (expected !== actual) {
        throw new gulpUtil.PluginError({
            plugin: 'gulp-i18n-json-tools',
            message: 'Error: Expected merge content is not equal to actual merge content'
        });
    }

    var expected = fs.readFileSync('./assets/expected-test-csv.csv', 'utf8');
    var actual = fs.readFileSync('./assets/gen/test-csv.csv', 'utf8');
    if (expected !== actual) {
        throw new gulpUtil.PluginError({
            plugin: 'gulp-i18n-json-tools',
            message: 'Error: Expected export CSV content is not equal to actual csv content'
        });
    }
});

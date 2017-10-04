var gulpUtil = require('gulp-util');

var gulp = require('gulp');
var jsonMerger = require('../index');

gulp.task('default', function () {
    var base = require('./json/a.json');
    var override = require('./json/b.json');
    return jsonMerger(base, override, 'ab.json')
        .pipe(gulp.dest('./json/merged'));
});

gulp.task('test', function () {
    var expected = JSON.stringify(require('./json/expected-ab.json'));
    var actual = JSON.stringify(require('./json/merged/ab.json'));
    if (expected !== actual) {
        throw new gulpUtil.PluginError({
            plugin: 'gulp-json-merger',
            message: 'Error: Expected merge content is not equal to actual merge content'
        });
    }
});
    
var gulp = require('gulp');
var jsonMerge = require('./gulp/jsonMerge');

gulp.task('default', function () {
    var source = require('./json/a.json');
    var target = require('./json/b.json');
    return jsonMerge(source, target, 'ab.json')
        .pipe(gulp.dest('./json/merged'));
});
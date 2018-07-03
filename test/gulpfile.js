var PluginError = require('plugin-error'),
    gulp = require('gulp'),
    fs = require('fs'),
    i18nJsonTools = require('../index');

function mergeDemo() {
    return i18nJsonTools
        .jsonMerger(
            require('./merge/en.json'),     // base language to inherit missing keys
            require('./merge/es.json'),     // language to merge with base language
            'result-es.json')               // output file name
        .pipe(gulp.dest('./merge'));        // destination folder
}

function exportDemo() {
    return i18nJsonTools
        .jsonToCsv(
            require('./export/en.json'),    // json to export to CSV
            'result-en.csv')                // output file name
        .pipe(gulp.dest('./export'));       // destination folder
}

function importDemo() {
    return i18nJsonTools
        .updateJsonFromCsv(
            require('./import/to-fill.json'),               // target json to try to fill with csv keys
            fs.readFileSync('./import/en.csv', 'utf8'),     // csv to import
            'result-en.json')                               // output file updated with csv matched content
        .pipe(gulp.dest('./import'));                       // destination folder
}

gulp.task('importDemo', importDemo);
gulp.task('exportDemo', exportDemo);
gulp.task('mergeDemo', mergeDemo);
gulp.task('run', gulp.parallel('mergeDemo', 'exportDemo', 'importDemo'));

function testMerge () {
    var expected = JSON.stringify(require('./merge/expected-result-es.json'));
    var actual = JSON.stringify(require('./merge/result-es.json'));
    assertStringEquals(expected, actual, 'Expected merge content is not equal to actual merge content');
    return emptyTask();
}

function testExport () {
    var expected = fs.readFileSync('./export/expected-result-en.csv', 'utf8');
    var actual = fs.readFileSync('./export/result-en.csv', 'utf8');
    assertStringEquals(expected, actual, 'Expected export CSV content is not equal to actual csv content');
    return emptyTask();
}

function testImport() {
    var expected = fs.readFileSync('./import/expected-result-en.json', 'utf8');
    var actual = fs.readFileSync('./import/result-en.json', 'utf8');
    assertStringEquals(expected, actual, 'Expected import result as json from CSV is not equal to expected')
    return emptyTask();
}

gulp.task('testMerge', gulp.series(mergeDemo, testMerge));
gulp.task('testExport', gulp.series(exportDemo, testExport));
gulp.task('testImport', gulp.series(importDemo, testImport));

gulp.task('default', gulp.parallel('testMerge', 'testExport', 'testImport'));

/** Test utils **/

function assertArrayEquals(arr1, arr2, message) {
    message = message || '';
    arr1.forEach((val, i) => {
        if ( typeof val === 'string' && typeof arr2[i] === 'string') {
            var regex = /(\r\n|\n|\r|\\r\\n|\\n|\\r)/gm;
            var a = val.replace(regex,'');
            var b = arr2[i].replace(regex,'');
            if (a !== b) {
                assertionFailed(formatParams(message, 'Found differences between strings', a, b));
            }
        } else if (val !== arr2[i]) {
            assertionFailed(formatParams(message, 'Found differences between values', val, arr2[i]));
        }
    });
}

function assertStringEquals(string1, string2, message) {
    message = message || '';
    var regex = /^.*((\r\n|\n|\r|\\r\\n|\\n|\\r)|$)/gm;
    if (string1.split(regex).length !== string2.split(regex).length) {
        assertionFailed(formatParams(message, 'Found diferent line endings'));
    }
    assertArrayEquals(string1.match(regex), string2.match(regex), message)
}

function assertionFailed(message) {
    throw new PluginError({
        plugin: 'gulp-i18n-json-tools',
        message: message
    });
}

function emptyTask() {
    return gulp.src('./*/emptytask').pipe(gulp.dest('.'));
}

function formatParams() {
    var content = '';
    for (var i = 0; i < arguments.length; i++) {
        content += serialize(arguments[i]) + '\r\n';
    }
    return content;

    function serialize(object) {
        if (typeof object === "string" || typeof object === "number") {
            return object;
        }
        return JSON.stringify(object);
    }
}
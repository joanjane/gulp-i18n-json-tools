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
        assertionFailed('Error: Expected merge content is not equal to actual merge content');
    }
});

gulp.task('test:export', function () {
    var expected = fs.readFileSync('./export/expected-result-en.csv', 'utf8');
    var actual = fs.readFileSync('./export/result-en.csv', 'utf8');
    
    if (!stringEquals(expected, actual)) {
        assertionFailed(`Error: Expected export CSV content is not equal to actual csv content => ` + 
            '\r\n' + expected + '\r\n\r\n' + actual + '');
    }
});

gulp.task('test:import', function () {
    var expected = fs.readFileSync('./import/expected-result-en.json', 'utf8');
    var actual = fs.readFileSync('./import/result-en.json', 'utf8');
    if (!stringEquals(expected, actual)) {
        assertionFailed(`Error: Expected import result as json from CSV is not equal to expected\r\n`
            + expected
            + '\r\n'
            + actual);
    }
});


/** Test utils **/

function arrayEquals(arr1, arr2) {
    var eq = true;
    arr1.forEach((val, i) => {
        if ( typeof val === 'string' && typeof arr2[i] === 'string') {
            var a = val.replace(/(\r\n|\n|\r)/gm,'');
            var b = val.replace(/(\r\n|\n|\r)/gm,'');
            if (a !== b) {
                console.log('Found differences between values', a, b);
                eq = false;
            }
        } else if (val !== arr2[i]) {
            console.log('Found differences between values', val, arr2[i]);
            eq = false;
        }
    });
    return eq;
}

function stringEquals(string1, string2) {
    var regex = /^.*((\r\n|\n|\r)|$)/gm;
    if (string1.split(regex).length !== string2.split(regex).length) {
        console.log('Found diferent line endings');
        return false;
    }
    if (!arrayEquals(string1.match(regex), string2.match(regex))) {
        console.log('String content mismatch');
        return false;
    }
    return true;
}

function assertionFailed(message) {
    throw new gulpUtil.PluginError({
        plugin: 'gulp-i18n-json-tools',
        message: message
    });
}
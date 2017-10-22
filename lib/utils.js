module.exports = {
    objectMerge: objectMerge,
    textWriter: textWriter,
    flatJson: flatJsonApi,
    flatJsonToArray: flatJsonToArray,
    arrayToCsv: arrayToCsv,
    updateJsonFromCsv: updateJsonFromCsv
};

// http://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
}

function objectMerge(base, override) {
    let output = Object.assign({}, base);
    if (isObject(base) && isObject(override)) {
        Object.keys(override).forEach(key => {
            if (isObject(override[key])) {
                if (!(key in base)) {
                    Object.assign(output, { [key]: override[key] });
                }
                else {
                    output[key] = objectMerge(base[key], override[key]);
                }
            } else {
                Object.assign(output, { [key]: override[key] });
            }
        });
    }
    return output;
}

// http://stackoverflow.com/questions/23230569/how-do-you-create-a-file-from-a-string-in-gulp
function textWriter(filename, string) {
    var gutil = require('gulp-util');
    var src = require('stream').Readable({ objectMode: true });
    src._read = function () {
        this.push(new gutil.File({
            cwd: "",
            base: "",
            path: filename,
            contents: new Buffer(string)
        }));
        this.push(null);
    };
    return src;
}

function flatJsonApi(json, options) {
    var flattenedJson = {};
    flatJson(json, flattenedJson, null, options);
    return flattenedJson;
}
    
function flatJson(json, output, currentKey, options) {
    // setup separators
    options = options || {};
    options.keySeparator = options.keySeparator ? options.keySeparator : '.';
    options.arrayIndexMark = options.arrayIndexMark ? options.arrayIndexMark : '$';

    if (!isObject(json)) {
        Object.assign(output, { [currentKey]: json });
        return;
    }
    
    currentKey = currentKey ? currentKey + options.keySeparator : '';
    
    Object.keys(json).forEach(key => {
        if (isObject(json[key])) {
            flatJson(json[key], output, currentKey + key, options);
        } else if (Array.isArray(json[key])) {
            json[key].forEach((v, i) => {
                var currentArrKey = currentKey + key + options.keySeparator + options.arrayIndexMark + i.toString();
                flatJson(v, output, currentArrKey, options);
            });
        } else {
            Object.assign(output, { [currentKey + key]: json[key] });
        }
    });
}

function flatJsonToArray(json) {
    return Object.keys(json).map(key => [key, json[key]]);
}

function arrayToCsv(lines, options) {
    options = options || {};
    options.separator = options.separator ? options.separator : ',';
    options.lineBreak = options.lineBreak ? options.lineBreak : '\r\n';
    options.addSeparatorMark = options.addSeparatorMark || false;

    var output = '';
    if (options.addSeparatorMark){
        output = 'sep=' + options.separator + options.lineBreak;
    }

    output += lines.map(line => line
            .map(field => sanitizeCsvValue(field, options))
            .join(options.separator)
        ).join(options.lineBreak);

    return output;
}

function replace(target, search, replacement) {
    return target.split(search).join(replacement);
}

function sanitizeCsvValue(rawVal, options) {
    var escapedQuotesVal = rawVal.replace(new RegExp('"', 'g'), '""'); // escape quotes with double quotes
    var hasToQuoteRegex = new RegExp(`(?:\r\n|\r|\n|${options.separator}|")`, 'g');
    if (hasToQuoteRegex.test(escapedQuotesVal)) {
        // on field containing line breaks or separator, embrace it in quotes
        escapedQuotesVal = '"' + escapedQuotesVal + '"';
    }

    return escapedQuotesVal;
}

function updateJsonFromCsv(targetJson, importCsv, options) {
    var Papa = require('papaparse');

    options = options || {};
    options.json = options.json || {};
    options.json.keySeparator = options.json.keySeparator ? options.json.keySeparator : '.';
    options.json.arrayIndexMark = options.json.arrayIndexMark ? options.json.arrayIndexMark : '$';
    options.csv = options.csv || {};
    options.csv.separator = options.csv.separator ? options.csv.separator : ',';

    var parsedJson = Papa.parse(importCsv, {
        delimiter: options.csv.separator,
        newline: options.csv.lineBreak
    });

    for (var line of parsedJson.data) {
        var keys = line[0].split(options.json.keySeparator);
        importValueFromCsv(targetJson, keys, line[1], options.json.arrayIndexMark);
    }
}

function importValueFromCsv(json, remainingKeys, finalValue, arrayIndexMark) {
    if (!remainingKeys) {
        return;
    }
    var key = remainingKeys.shift();
    if (remainingKeys.length === 0) {
        if (key[0] === arrayIndexMark) {
            key = parseInt(key.slice(1));
            if (!Array.isArray(json)) {
                json = [];
            }
            if (json.length -1 < key) {
                // if there are less items on array than index, append value
                json.push(finalValue);
            } else {
                // if we can override directly a item of an array, then update it
                json[key] = finalValue;
            }
        } else {
            json[key] = finalValue;
        }
        return;
    }

    if (!json[key]) {
        if (key[0] === arrayIndexMark) {
            // check if array value
            key = key.slice(1);
            json[key] = json[key] || {};
        } else if (remainingKeys[0] && remainingKeys[0][0] === arrayIndexMark) {
            // check if is array looking at first child
            json[key] = [];
        } else {
            json[key] = {};
        }
    }
    importValueFromCsv(json[key], remainingKeys, finalValue, arrayIndexMark);
}
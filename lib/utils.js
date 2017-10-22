/**
 * Perform a deep merge between a two objects
 * Source: http://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
 * @param {object} base Object which keys will be inherited
 * @param {object} override Object which present keys will be used overriding base object
 */
module.exports.objectMerge = function objectMerge(base, override) {
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

/**
 * Export an object to csv
 * @param {object} json Object to export to csv
 * @param {SerializationOptions} options csv and json serialization options
 */
module.exports.convertJsonToCsv = function convertJsonToCsv(json, options) {
    options = options || {};
    var flattenedJson = {};
    flatJsonRecursive(json, flattenedJson, null, options.json);
    var contentLines =  Object.keys(flattenedJson).map(key => [key, flattenedJson[key]]);
    return arrayToCsv(contentLines, options.csv);
}

/**
 * Import csv and update json object given
 * @param {object} targetJson object to update with csv content
 * @param {string} importCsv Content of csv to import to targetJson
 * @param {SerializationOptions} options csv and json deserialization options
 */
module.exports.updateJsonFromCsv = function updateJsonFromCsv(targetJson, importCsv, options) {
    const Papa = require('papaparse');

    options = options || {};
    options.json = defaultJsonOptions(options.json);
    options.csv = options.csv || {};
    options.csv.separator = options.csv.separator ? options.csv.separator : ',';

    var parsedJson = Papa.parse(importCsv, {
        delimiter: options.csv.separator,
        newline: options.csv.lineBreak
    });

    for (var line of parsedJson.data) {
        var keys = line[0].split(options.json.keySeparator);
        var value = line[1];
        importValueFromCsv(targetJson, keys, value, options.json.arrayIndexMark);
    }
}

/**
 * @param {object} json 
 * @param {string[]} remainingKeys csv serialized key to be unfolded
 * @param {any} finalValue value to be set on json
 * @param {string} arrayIndexMark Character to be used to mark an array position when serializing to csv
 */
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

/**
 * Flat json object into a single level key value
 * @param {object} json Object to flat
 * @param {object} output Output object flattened
 * @param {string} currentKey current key that is serializing, pass null initially
 * @param {JsonSerializationOptions} options Json key serialization options
 * @returns {object} Flattened json
 */
function flatJsonRecursive(json, output, currentKey, options) {
    options = defaultJsonOptions(options);

    if (!isObject(json)) {
        Object.assign(output, { [currentKey]: json });
        return;
    }
    
    currentKey = currentKey ? currentKey + options.keySeparator : '';
    
    Object.keys(json).forEach(key => {
        if (isObject(json[key])) {
            flatJsonRecursive(json[key], output, currentKey + key, options);
        } else if (Array.isArray(json[key])) {
            json[key].forEach((v, i) => {
                var currentArrKey = currentKey + key + options.keySeparator + options.arrayIndexMark + i.toString();
                flatJsonRecursive(v, output, currentArrKey, options);
            });
        } else {
            Object.assign(output, { [currentKey + key]: json[key] });
        }
    });
}

/**
 * Export a multidimensional array to csv
 * @param {Array<Array<string>>} lines Lines of csv to be exported 
 * @param {CsvSerializationOptions} options to override default separator and lineBreak 
 * @returns {string} csv content
 */
function arrayToCsv(lines, options) {
    options = defaultCsvOptions(options);
    return lines.map(line => line
            .map(field => sanitizeCsvValue(field, options))
            .join(options.separator)
        ).join(options.lineBreak);
}

/**
 * Sanitize a value to be compliant with csv spec
 * @param {string} rawVal 
 * @param {CsvSerializationOptions} options csv serialization options 
 */
function sanitizeCsvValue(rawVal, options) {
    var escapedQuotesVal = rawVal.replace(new RegExp('"', 'g'), '""'); // escape quotes with double quotes
    var hasToQuoteRegex = new RegExp(`(?:\r\n|\r|\n|${options.separator}|")`, 'g');
    if (hasToQuoteRegex.test(escapedQuotesVal)) {
        // on field containing line breaks or separator, embrace it in quotes
        escapedQuotesVal = '"' + escapedQuotesVal + '"';
    }

    return escapedQuotesVal;
}

// Utils
/**
 * Check if param is an object
 * @param {any} item 
 */
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
}

/**
 * Replace content from string
 * @param {string} target Text to apply replacement 
 * @param {string} search Text to match
 * @param {string} replacement Replacement of matched text
 */
function replace(target, search, replacement) {
    return target.split(search).join(replacement);
}

/**
 * @param {JsonSerializationOptions} options 
 */
function defaultJsonOptions(options) {
    options = options || {};
    options.keySeparator = options.keySeparator ? options.keySeparator : '.';
    options.arrayIndexMark = options.arrayIndexMark ? options.arrayIndexMark : '$';
    return options;
}

/**
 * @param {CsvSerializationOptions} options 
 */
function defaultCsvOptions(options) {
    options = options || {};
    options.separator = options.separator ? options.separator : ',';
    options.lineBreak = options.lineBreak ? options.lineBreak : '\r\n';
    return options;
}
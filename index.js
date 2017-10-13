var utils = require('./lib/utils'),
    Papa = require('papaparse');

module.exports = {
    jsonMerger: function (baseJson, overrideJson, outputFileName) {
        var result = utils.objectMerge(baseJson, overrideJson);

        return utils.textWriter(outputFileName, JSON.stringify(result));
    },
    jsonToCsv: function (json, outputFileName, options) {
        options = options || {};
        var flattenedJson = utils.flatJson(json, options.json);
        var contentLines = utils.flatJsonToArray(flattenedJson, options.csv);

        return utils.textWriter(outputFileName, utils.arrayToCsv(contentLines));
    },
    updateJsonFromCsv: function (targetJson, importCsv, outputFileName, options) {
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
            setVal(targetJson, keys, line[1], options.json.arrayIndexMark);
        }

        return utils.textWriter(outputFileName, JSON.stringify(targetJson));
    }
};


function setVal(json, remainingKeys, finalValue, arrayIndexMark) {
    if (!remainingKeys) {
        return;
    }
    var key = remainingKeys.shift();
    if (remainingKeys.length === 0) {
        if (key[0] === '$') {
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
        if (key[0] === '$') {
            // check if array value
            key = key.slice(1);
            json[key] = {};
        } else if (remainingKeys[0] && remainingKeys[0][0] === '$') {
            // check if is array lloking at first child
            json[key] = [];
        }
    }
    setVal(json[key], remainingKeys, finalValue, arrayIndexMark);
}
const utils = require('./lib/utils');

module.exports.jsonMerger = function (baseJson, overrideJson, outputFileName) {
    var result = utils.objectMerge(baseJson, overrideJson);

    return textWriter(outputFileName, JSON.stringify(result));
};

module.exports.jsonToCsv = function (json, outputFileName, options) {
    return textWriter(outputFileName, utils.convertJsonToCsv(json, options));
};

module.exports.updateJsonFromCsv = function (targetJson, importCsv, outputFileName, options) {
    utils.updateJsonFromCsv(targetJson, importCsv, options);
    return textWriter(outputFileName, JSON.stringify(targetJson));
};

/**
 * Output a file with a name and content
 * Source: http://stackoverflow.com/questions/23230569/how-do-you-create-a-file-from-a-string-in-gulp
 * @param {string} filename
 * @param {string} content
 */
function textWriter(filename, content) {
    var Vinyl = require('vinyl');
    var src = require('stream').Readable({ objectMode: true });
    src._read = function () {
        this.push(new Vinyl({
            cwd: '',
            base: '.',
            path: filename,
            contents: new Buffer(content)
        }));
        this.push(null);
    };
    return src;
}
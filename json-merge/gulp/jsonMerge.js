var textWriter = require('./textWriter');
var objectMerge = require('./objectMerge');

module.exports = function jsonMerge(target, source, outputFile) {
    var result = objectMerge(target, source);

    return textWriter(outputFile, JSON.stringify(result));
};
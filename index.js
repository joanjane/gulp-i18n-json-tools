var utils = require('./lib/utils');

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
        utils.updateJsonFromCsv(targetJson, importCsv, options);
        return utils.textWriter(outputFileName, JSON.stringify(targetJson));
    }
};

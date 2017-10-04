module.exports = function jsonMerger(baseFile, overrideFile, outputFile) {
    var result = objectMerge(baseFile, overrideFile);

    return textWriter(outputFile, JSON.stringify(result));
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
        }))
        this.push(null)
    };
    return src;
};
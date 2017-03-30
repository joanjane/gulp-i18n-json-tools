// http://stackoverflow.com/questions/23230569/how-do-you-create-a-file-from-a-string-in-gulp
module.exports = function textWriter(filename, string) {
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
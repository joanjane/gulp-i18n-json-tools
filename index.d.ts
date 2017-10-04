declare module 'gulp-json-merger' {
    /**
     * @param baseFile json file used as a template which keys can be overriden
     * @param overrideFile json file which overrides keys of originalFile
     * @param outputFile path and name of output merged file
     */
    const jsonMerger: (baseFile: string, overrideFile: string, outputFile: string) => NodeJS.ReadStream;
    export = jsonMerger;
}
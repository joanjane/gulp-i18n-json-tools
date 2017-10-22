declare module 'gulp-i18n-json-tools' {
    /**
     * @param baseJson json used as a template which keys can be overriden
     * @param overrideJson json which overrides keys of originalFile
     * @param outputFileName name of output merged file
     */
    const jsonMerger: (baseJson: object, overrideJson: object, outputFileName: string) => NodeJS.ReadStream;
    
    /**
     * @param json json to flat as a csv file
     * @param outputFileName name of output csv file
     * @param options (optional) advanced options of csv and flattening json. See JsonToCsvOptions type for details
     */
    const jsonToCsv: (json: object, outputFileName: string, options?: SerializationOptions) => NodeJS.ReadStream;

    /**
     * @param targetJson json to be updated with matched keys
     * @param importCsv content of csv to import
     * @param outputFileName name of output updated json
     * @param options (optional) advanced options of csv and flattening json. See JsonToCsvOptions type for details
     */
    const updateJsonFromCsv: (targetJson: object, importCsv: string, outputFileName: string, options?: SerializationOptions) => NodeJS.ReadStream;

    export = {
        jsonMerger,
        jsonToCsv,
        updateJsonFromCsv
    };

    type SerializationOptions = {
        json?: JsonSerializationOptions,
        csv?: CsvSerializationOptions
    };

    type JsonSerializationOptions = {
        /**
         * Json property separator (ex: {A: { B: 'hello' } } => "A.B": "hello")
         * @default '.'
         */
        keySeparator: string,
        /**
         * When serializing arrays, add a special mark on the index (ex: { A: ['hello'] } => "A.$0": "hello")
         * @default '$'
         */
        arrayIndexMark: string
    };

    type CsvSerializationOptions = {
        /**
         * CSV separator
         * @default ','
         */
        separator: string,
        /**
         * Line break symbol
         * @default '\r\n'
         */
        lineBreak: string
    };
}
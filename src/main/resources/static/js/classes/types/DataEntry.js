export class DataEntry {

    static typeTranslationMap = new Map([

            // Basic
        [ "dir",        [ "folder2",                    "Folder" ] ],
        [ "txt",        [ "file-earmark-text",          "Text file" ] ],

            // Compressed
        [ "zip",        [ "file-earmark-zip",           "Compressed (zip)" ] ],
        [ "gzip",       [ "file-earmark-zip",           "Compressed (gzip)" ] ],
        [ "7zip",       [ "file-earmark-zip",           "Compressed (7zip)" ] ],
        [ "7z",         [ "file-earmark-zip",           "Compressed (7zip)" ] ],
        [ "rar",        [ "file-earmark-zip",           "Compressed (rar)" ] ],
        [ "bzip2",      [ "file-earmark-zip",           "Compressed (bzip2)" ] ],
        [ "gz",         [ "file-earmark-zip",           "Compressed (gzip)" ] ],

            // Audio
        [ "mp3",        [ "file-earmark-music",         "Audio" ] ],
        [ "ogg",        [ "file-earmark-music",         "Audio" ] ],
        [ "wav",        [ "file-earmark-music",         "Audio" ] ],
        [ "midi",       [ "file-earmark-music",         "Audio" ] ],
        [ "aif",        [ "file-earmark-music",         "Audio" ] ],

            // Video
        [ "mp4",        [ "file-earmark-play",          "Video" ] ],
        [ "mkv",        [ "file-earmark-play",          "Video" ] ],
        [ "avi",        [ "file-earmark-play",          "Video" ] ],
        [ "mpeg",       [ "file-earmark-play",          "Video" ] ],
        [ "webm",       [ "file-earmark-play",          "Video" ] ],

            // Images
        [ "png",        [ "file-earmark-image",         "Image" ] ],
        [ "jpg",        [ "file-earmark-image",         "Image" ] ],
        [ "jpeg",       [ "file-earmark-image",         "Image" ] ],
        [ "jfif",       [ "file-earmark-image",         "Image" ] ],
        [ "pdn",        [ "file-earmark-image",         "Image" ] ],
        [ "tiff",       [ "file-earmark-image",         "Image" ] ],
        [ "webp",       [ "file-earmark-image",         "Image" ] ],
        [ "xcf",        [ "file-earmark-image",         "Image" ] ],
        [ "gif",        [ "file-earmark-image",         "Image" ] ],
        [ "tga",        [ "file-earmark-image",         "Image" ] ],
        [ "ico",        [ "file-earmark-image",         "Image" ] ],
        [ "exif",       [ "file-earmark-image",         "Image" ] ],    
        [ "svg",        [ "file-earmark-image",         "Image" ] ],

            // Documents
        [ "pdf",        [ "file-earmark-pdf",           "Document" ] ],
        
            // Presentation
        [ "ppt",        [ "file-earmark-slides",        "Presentation" ] ],
        [ "pptx",       [ "file-earmark-slides",        "Presentation" ] ],
        [ "odp",        [ "file-earmark-slides",        "Presentation" ] ],

            // Spreadsheet
        [ "xls",        [ "file-earmark-spreadsheet",   "Spreadsheet" ] ],
        [ "xlsm",       [ "file-earmark-spreadsheet",   "Spreadsheet" ] ],
        [ "xlsx",       [ "file-earmark-spreadsheet",   "Spreadsheet" ] ],
        [ "ods",        [ "file-earmark-spreadsheet",   "Spreadsheet" ] ],

            // Word processors
        [ "doc",        [ "file-earmark-richtext",      "Document" ] ],
        [ "docx",       [ "file-earmark-richtext",      "Document" ] ],
        [ "odt",        [ "file-earmark-richtext",      "Document" ] ],
        [ "rtf",        [ "file-earmark-richtext",      "Document" ] ],
        [ "tex",        [ "file-earmark-richtext",      "Document" ] ],

            // Data/Programming related
        [ "sql",        [ "database",                   "Database" ] ],            

            // Others
        [ "bin",        [ "file-earmark-binary",        "Binary" ] ],
        [ "tar",        [ "file-earmark-zip",           "Tarball" ] ],
        [ "deb",        [ "file-earmark-zip",           "Debian package" ] ],
        [ "generic",    [ "file-earmark",               "Generic" ] ],
        [ "unknown",    [ "file-earmark",               "Unknown" ] ]

    ]);

        /**
         * Takes a JSON object and returns a DataEntry instance from it.
         * Must have 'name', 'type', 'size', and 'pathTo' defined.
         * @param {any} JSON 
         * @returns {DataEntry}
         */
    static fromJSON( JSON ) {

        const { name, type, size, pathTo } = JSON;

        if( name != undefined && type != undefined && size != undefined && pathTo != undefined ) {
            return new DataEntry( name, type, size, pathTo );
        } else {
            throw new Error( "Invalid JSON data passed to DataEntry constructor." );
        }

    }

        /**   
         * @param {string} name 
         * @param {string} type 
         * @param {number} size 
         * @param {string} pathTo 
         */
    constructor( name, type, size, pathTo ) {

        this.name = name;

        if( DataEntry.typeTranslationMap.has( type ) ) {
            this.type = type;
        } else
        if( type === "" ) {
            this.type = "generic";
        } else {
            this.type = "unknown";
        }

        this.size = size;
        this.pathTo = pathTo;

    }

        /**        
         * @returns {string} A human readable string of the DataEntry's size.  
         */
    humanReadableSize() {

        let sizeInBytes = this.size;

        const units = [

            "Bytes",
            "Kilobytes",
            "Megabytes",
            "Gigabytes",
            "Terabytes",
            "Petabytes",
            "Exabytes",
            "Zettabytes",
            "Yottabytes",
            "Brontobytes",
            "Geopbytes"

        ];

        let scale = 0;

        while( sizeInBytes >= 1000 && ++scale ) {
            sizeInBytes /= 1000;
        }

        let readableSize = "";

        if( this.size > -1 ) {
            readableSize = sizeInBytes.toFixed( scale > 0 ? 1 : 0 ) + " " + units[scale];
        } else {
            readableSize = "...";
        }

        return readableSize;

    }

        /**
         * @returns {HTMLElement} An icon element representing the file type of the DataEntry.
         */
    iconElement() {

        const iconElement = document.createElement( "i" );
        iconElement.classList.add( "bi" );

        const icon = DataEntry.typeTranslationMap.get( this.type )[0];
        const iconClass = "bi-" + icon;

        iconElement.classList.add( iconClass );
        iconElement.ariaHidden = "true";

        return iconElement;

    }

        /**
         * @returns {string} A human-friendly name for the file's extension.
         */
    mappedFileType() {
        return DataEntry.typeTranslationMap.get( this.type )[1];
    }

        /**         
         * @returns {string[]} An array representing the data entry.
         */
    dataArray() {

        return [

            this.name,
            this.mappedFileType(),
            this.humanReadableSize()

        ];

    }

}
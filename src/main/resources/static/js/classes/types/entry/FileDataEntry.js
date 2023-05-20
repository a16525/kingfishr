import { Entry } from "./Entry.js";
import { FileTypeTranslator } from "./FileTypeTranslator.js";

export class FileDataEntry extends Entry {

    /**
     * @typedef {Object} FileDataEntryLike
     * @property {String} name
     * @property {String} type
     * @property {Number} size
     * @property {String} pathTo
     */

    static typeTranslationMap = new Map([
            // Basic
        [ "dir",     new FileTypeTranslator( "folder2",                  "Folder" ) ],
        [ "txt",     new FileTypeTranslator( "file-earmark-text",        "Text file" ) ],

            // Compressed
        [ "zip",     new FileTypeTranslator( "file-earmark-zip",         "Compressed (zip)" ) ],
        [ "gzip",    new FileTypeTranslator( "file-earmark-zip",         "Compressed (gzip)" ) ],
        [ "7zip",    new FileTypeTranslator( "file-earmark-zip",         "Compressed (7zip)" ) ],
        [ "7z",      new FileTypeTranslator( "file-earmark-zip",         "Compressed (7zip)" ) ],
        [ "rar",     new FileTypeTranslator( "file-earmark-zip",         "Compressed (rar)" ) ],
        [ "bzip2",   new FileTypeTranslator( "file-earmark-zip",         "Compressed (bzip2)" ) ],
        [ "gz",      new FileTypeTranslator( "file-earmark-zip",         "Compressed (gzip)" ) ],

            // Audio
        [ "mp3",     new FileTypeTranslator( "file-earmark-music",       "Audio" ) ],
        [ "ogg",     new FileTypeTranslator( "file-earmark-music",       "Audio" ) ],
        [ "wav",     new FileTypeTranslator( "file-earmark-music",       "Audio" ) ],
        [ "midi",    new FileTypeTranslator( "file-earmark-music",       "Audio" ) ],
        [ "aif",     new FileTypeTranslator( "file-earmark-music",       "Audio" ) ],

            // Video
        [ "mp4",     new FileTypeTranslator( "file-earmark-play",        "Video" ) ],
        [ "mkv",     new FileTypeTranslator( "file-earmark-play",        "Video" ) ],
        [ "avi",     new FileTypeTranslator( "file-earmark-play",        "Video" ) ],
        [ "mpeg",    new FileTypeTranslator( "file-earmark-play",        "Video" ) ],
        [ "webm",    new FileTypeTranslator( "file-earmark-play",        "Video" ) ],
        [ "mov",     new FileTypeTranslator( "file-earmark-play",        "Video" ) ],

            // Images
        [ "png",     new FileTypeTranslator( "file-earmark-image",       "Image" ) ],
        [ "jpg",     new FileTypeTranslator( "file-earmark-image",       "Image" ) ],
        [ "jpeg",    new FileTypeTranslator( "file-earmark-image",       "Image" ) ],
        [ "jfif",    new FileTypeTranslator( "file-earmark-image",       "Image" ) ],
        [ "pdn",     new FileTypeTranslator( "file-earmark-image",       "Image" ) ],
        [ "tiff",    new FileTypeTranslator( "file-earmark-image",       "Image" ) ],
        [ "webp",    new FileTypeTranslator( "file-earmark-image",       "Image" ) ],
        [ "xcf",     new FileTypeTranslator( "file-earmark-image",       "Image" ) ],
        [ "gif",     new FileTypeTranslator( "file-earmark-image",       "Image" ) ],
        [ "tga",     new FileTypeTranslator( "file-earmark-image",       "Image" ) ],
        [ "ico",     new FileTypeTranslator( "file-earmark-image",       "Image" ) ],
        [ "exif",    new FileTypeTranslator( "file-earmark-image",       "Image" ) ],    
        [ "svg",     new FileTypeTranslator( "file-earmark-image",       "Image" ) ],

            // Documents
        [ "pdf",     new FileTypeTranslator( "file-earmark-pdf",         "PDF Document" ) ],
        
            // Presentation
        [ "ppt",     new FileTypeTranslator( "file-earmark-slides",      "Powerpoint presentation" ) ],
        [ "pptx",    new FileTypeTranslator( "file-earmark-slides",      "Powerpoint presentation" ) ],
        [ "odp",     new FileTypeTranslator( "file-earmark-slides",      "OpenDocument presentation" ) ],

            // Spreadsheet
        [ "xls",     new FileTypeTranslator( "file-earmark-spreadsheet", "Excel spreadsheet" ) ],
        [ "xlsm",    new FileTypeTranslator( "file-earmark-spreadsheet", "Excel spreadsheet (macros)" ) ],
        [ "xlsx",    new FileTypeTranslator( "file-earmark-spreadsheet", "Excel spreadsheet" ) ],
        [ "ods",     new FileTypeTranslator( "file-earmark-spreadsheet", "OpenDocument spreadsheet" ) ],

            // Word processors
        [ "doc",     new FileTypeTranslator( "file-earmark-richtext",    "Word document" ) ],
        [ "docx",    new FileTypeTranslator( "file-earmark-richtext",    "Word document" ) ],
        [ "odt",     new FileTypeTranslator( "file-earmark-richtext",    "OpenDocument document" ) ],
        [ "rtf",     new FileTypeTranslator( "file-earmark-richtext",    "Rich-text file" ) ],
        [ "tex",     new FileTypeTranslator( "file-earmark-richtext",    "LaTeX document" ) ],

            // Data/Programming related
        [ "sql",     new FileTypeTranslator( "database",                 "SQL Database" ) ],            

            // Others
        [ "bin",     new FileTypeTranslator( "file-earmark-binary",      "Binary" ) ],
        [ "tar",     new FileTypeTranslator( "file-earmark-zip",         "Tarball" ) ],
        [ "deb",     new FileTypeTranslator( "file-earmark-zip",         "Debian package" ) ],
        [ "generic", new FileTypeTranslator( "file-earmark",             "Generic" ) ],
        [ "unknown", new FileTypeTranslator( "file-earmark",             "Unknown" ) ]
    ]);

        /**
         * @override
         * @param {FileDataEntryLike} JSON
         * @returns {FileDataEntry}
         */
    static fromJSON( JSON ) {

        const { name, type, size, pathTo } = JSON;

        if( name != undefined && type != undefined && size != undefined && pathTo != undefined ) {
            return new FileDataEntry( name, type, size, pathTo );
        } else {
            throw new Error( "Invalid JSON data." );
        }

    }
    
        /**         
         * @param {String} name 
         * @param {String} type 
         * @param {Number} size 
         * @param {String} pathTo 
         */
    constructor( name, type, size, pathTo ) {

        this.name = name;

        if( FileDataEntry.typeTranslationMap.has( type ) ) {
            this.type = type;
        } else {

            if( type === "" ) {
                this.type = "generic";
            } else {
                this.type = "unknown";
            }

        }

        this.size = size;
        this.pathTo = pathTo;

    }

        /**
         * @returns {String}
         */
    humanReadableSize() {

        const units = [
            "Bytes",
            "Kilobytes",
            "Megabytes",
            "Gigabytes",
            "Terabytes",
            "Petabytes",
            "Exabytes",
            "Zettabytes",
            "Brontobytes",
            "Geopbytes"
        ];

        let sizeInBytes = this.size;
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
         * @returns {HTMLElement}
         */
    iconElement() {

        const iconElement = document.createElement( "i" ); 
        iconElement.classList.add( "bi" );

        const icon = FileDataEntry.typeTranslationMap.get( this.type ).fileIcon;
        const iconClass = "bi-" + icon;

        iconElement.classList.add( iconClass );
        iconElement.ariaHidden = "true";

        return iconElement;

    }

        /**
         * @returns {String}
         */
    mappedFileType() {
        return FileDataEntry.typeTranslationMap.get( this.type ).humanReadableName;
    }

        /**
         * @override
         * @returns {String[]}
         */
    dataArray() {

        return [
            this.name,
            this.mappedFileType(),
            this.humanReadableSize(),
        ];

    }

}
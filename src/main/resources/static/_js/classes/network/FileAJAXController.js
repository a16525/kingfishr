import { Endpoint } from "../types/Endpoint.js";
import { DataEntry } from "../types/DataEntry.js"
import { AJAXController } from "./AJAXController.js";
import { KFUploadToast } from "../types/toasts/KFUploadToast.js";

export class FileAJAXController extends AJAXController {

    static endpoints = {

        DIRCONTENTS: new Endpoint( "/api/dir/contents", Endpoint.HTTPMethods.GET ),
        DIREXISTS: new Endpoint( "/api/dir", Endpoint.HTTPMethods.GET ),
        DIRCREATE: new Endpoint( "/api/dir", Endpoint.HTTPMethods.POST ),
        UPLOADFILE: new Endpoint( "/api/file", Endpoint.HTTPMethods.GET )

    }
    
    constructor() {
        
        super();

            /**
             * @type {String}
             */
        this.workingDirectory = "/";

            /**
             * @type {Map<String, DataEntry>}
             */
        this.workingDirectoryContents = new Map();

    }

        /**
         * @returns {String} A string of eight random characters.
         */
    randomEntryID() {
        return Math.random().toString( 36 ).slice( 2, 10 );
    }

        /**
         * @param {String} directory
         * @returns {Map<String, DataEntry}
         */
    async getDirectoryContents( directory ) {

        const contentsMap = new Map();

        const endpoint = FileAJAXController.endpoints.DIRCONTENTS;
        const request = endpoint.appendParams( new URLSearchParams({ 
            dir: directory 
        }));

        await fetch( request, { method: endpoint.method } ).then( async response => {

            if( response.ok ) {

                const JSONData = await response.json();
                const contents = Array.from( JSONData ).map( value => DataEntry.fromJSON( value ) );
            
                contents.forEach( item => contentsMap.set( this.randomEntryID(), item ) );

            } else {
                throw new Error( await response.text() );
            }

        });

        return contentsMap;

    }

    async getWorkingDirectoryContents() {
        this.workingDirectoryContents = await this.getDirectoryContents( this.workingDirectory );
    }

        /**
         * Creates a directory in the current working directory.
         * @param {FormData} formData 
         */
    async createDirectory( formData ) {

        const illegalCharactersExp = "[#%&{}\\<>*?/$!'\":@+`|=]+?";
        const folderName = formData.get( "name" );

        if( folderName.length == 0 ) {
            throw new Error( "Folder name cannot be empty." );
        } else
        if( folderName.match( illegalCharactersExp ) != null ) {
            throw new Error( "Invalid folder name." );
        } else {

            const endpoint = FileAJAXController.endpoints.DIRCREATE;
            const request = endpoint.appendParams( new URLSearchParams({ 
                dir: this.workingDirectory, dirname: folderName
            }));

            await fetch( request, { method: endpoint.method } ).then( async response => {

                if( !response.ok ) {
                    throw new Error( await response.text() );
                }

            });

        }

    }

        /**
         * 
         * @param {File} file 
         * @param {KFUploadToast} uploadToast 
         */
    async uploadFile( file, uploadToast ) {

        const fileData = new FormData();
        fileData.append( "file", file );
        
        const endpoint = FileAJAXController.endpoints.FILEUPLOAD;
        const request = endpoint.appendParams( new URLSearchParams({
            dir: this.workingDirectory
        }));

        const xhr = new XMLHttpRequest();
        xhr.open( endpoint.method, request );

        xhr.upload.addEventListener( "progress", (evt) => {

            const complete = evt.loaded / evt.total;
            uploadToast.onProgress( complete );

        });

        xhr.addEventListener( "load", () => {

            if( !( xhr.status >= 200 && xhr.status < 300 ) ) {
                throw new Error( request.text() );
            }

        });

        uploadToast.addEventListener( "cancel-upload", () => {
            xhr.abort();
        });

        xhr.send( fileData );

    }

        /**
         * Sets the controller's working directory to home and updates the contents map.
         */
    async goToHome() {

        this.workingDirectory = "/";
        await this.getWorkingDirectoryContents();

    }

        /**
         * Sets the controller's working directory to the one above it and updates the content map.
         */
    async goUp() {

        if( this.workingDirectory != "/" ) {

            let splitDirectories = this.workingDirectory.split( "/" );
            splitDirectories.pop();

            this.workingDirectory = 
                splitDirectories.length == 0 ?
                    "/" :                           // if there are no directories above the current one
                    splitDirectories.join( "/" );   // if there are directories ...

            await this.getWorkingDirectoryContents();

        }

    }

}
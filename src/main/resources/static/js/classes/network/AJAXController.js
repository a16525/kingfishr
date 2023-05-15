import { DataEntry } from "../types/DataEntry.js";
import { KFUploadToast } from "../types/toasts/KFUploadToast.js";

export class AJAXController {

    static endpoints = {

        DIRCONTENTS: "api/dir/contents",
        DIREXISTS: "api/dir",
        DIRCREATE: "api/dir",
        UPLOADFILE: "api/file"

    }

    static HTTPMethods = {

        GET: "GET",
        POST: "POST",
        PUT: "PUT",
        DELETE: "DELETE"

    }

    constructor() {
        
        this.workingDirectory = "/";
        this.workingDirectoryContents = new Map();

    }

        /**         
         * @returns A string of eight random characters.
         */
    randomEntryID() {
        return Math.random().toString( 36 ).slice( 2, 10 );
    }

        /**
         * @param {string} directory
         * @returns {Map<string, DataEntry>?} The directory's contents.   
         */
    async getDirectoryContents( directory ) {

        const contentsMap = new Map();
        const searchParams = new URLSearchParams({ dir: directory });
        const endpoint = AJAXController.endpoints.DIRCONTENTS + "?";

        await fetch( endpoint + searchParams, {
            method: AJAXController.HTTPMethods.GET,
        }).then( async response => {

            if( response.ok ) {

                const jsonData = await response.json();
                const contents = Array.from( jsonData ).map( value => DataEntry.fromJSON( value ) );

                contents.forEach( item => contentsMap.set( this.randomEntryID(), item ) );

            } else {
                throw await response.text();
            }

        });

        return contentsMap;

    }

        /**
         * Gets the current working directory's contents.
         */
    async getWorkingDirectoryContents() {
        this.workingDirectoryContents = await this.getDirectoryContents( this.workingDirectory );
    }

        /**
         * Creates a new directory in the current working directory.
         * @param {FormData} formData
         */
    async createDirectory( formData ) {

        const illegalCharactersExp = "[#%&{}\\<>*?/$!'\":@+`|=]+?";
        const folderName = formData.get( "name" );

        if( folderName.length == 0 ) {
            throw "Folder name cannot be empty.";
        } else
        if( folderName.match( illegalCharactersExp ) != null ) {
            throw "Invalid folder name.";
        } else {

            const searchParams = new URLSearchParams({ dir: this.workingDirectory, dirname: folderName })
            const endpoint = AJAXController.endpoints.DIRCREATE + "?";

            await fetch( endpoint + searchParams, {
                method: AJAXController.HTTPMethods.POST
            }).then( async response => {

                if( response.ok ) {                    
                    // TBD
                } else {
                    throw await response.text();
                }

            });

        }

    }

        /**
         * Uploads a file.
         * @param {File} file 
         * @param {KFUploadToast} uploadToast
         */
    async uploadFile( file, uploadToast ) {        

        const fileData = new FormData();
        fileData.append( "file", file );        

        const searchParams = new URLSearchParams({ dir: this.workingDirectory });

        const request = new XMLHttpRequest();
        request.open( AJAXController.HTTPMethods.POST, AJAXController.endpoints.UPLOADFILE + "?" + searchParams );

        request.upload.addEventListener( 'progress', (evt) => {

            const complete = evt.loaded / evt.total;
            uploadToast.onProgress( complete );

        });

        request.addEventListener( 'load', () => {

            if( !( request.status >= 200 && request.status < 300 ) ) {
                throw request.responseText;
            }   

        });

        request.send( fileData );

    }

        /**
         * Downloads a file.
         * @param {string} pathtofile 
         */
    async downloadFile( pathtofile ) {

        

    }
        
        /**
         * Sets the controller's working directory to home.
         */
    async goToHome() {

        this.workingDirectory = "/";
        await this.getWorkingDirectoryContents();

    }

        /**
         * Sets the controller's working directory to the one above it (if not at the root).
         */
    async goUp() {

        if( this.workingDirectory != "/" ) {

            let splitDirectories = this.workingDirectory.split( "/" );
            splitDirectories.pop();

            let parentDirectory;
            
            if( splitDirectories.length == 0 ) {
                parentDirectory = "/";
            } else {
                parentDirectory = splitDirectories.join( "/" );
            }

            this.workingDirectory = parentDirectory;
            await this.getWorkingDirectoryContents();

        }

    }

}
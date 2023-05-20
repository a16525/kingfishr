import { AJAXController } from "./AJAXController.js";
import { Endpoint } from "../types/networking/Endpoint.js";
import { FileDataEntry } from "../types/entry/FileDataEntry.js";
import { KFUploadToast } from "../types/toasts/KFUploadToast.js";

export class FileManagerAJAXController extends AJAXController {

        /**
         * @override
         */
    static endpoints = {

        PATHEXISTS: new Endpoint( "/api/path", Endpoint.httpMethods.GET ),

        DIRCONTENTS: new Endpoint( "/api/dir/contents", Endpoint.httpMethods.GET ),
        CREATEDIR: new Endpoint( "/api/dir", Endpoint.httpMethods.POST ),
        RENAMEDIR: new Endpoint( "/api/dir", Endpoint.httpMethods.PATCH ),
        DELETEDIR: new Endpoint( "/api/dir", Endpoint.httpMethods.DELETE ),

        DOWNLOADFILE: new Endpoint( "/api/file", Endpoint.httpMethods.GET ),
        UPLOADFILE: new Endpoint( "/api/file", Endpoint.httpMethods.POST ),
        RENAMEFILE: new Endpoint( "/api/file", Endpoint.httpMethods.PATCH ),
        DELETEFILE: new Endpoint( "/api/file", Endpoint.httpMethods.DELETE ),

    }

    constructor() {

        super();

        this.workingDirectory = "/";

            /**
             * @type {Map<String, FileDataEntry>}
             */
        this.workingDirectoryContents = new Map();

    }

        /**
         * @param {length?}
         * @returns {String}
         */
    randomEntryID( length = 8 ) {
        return Math.random().toString( 36 ).slice( 2, 2 + length );
    }

        /**
         * @param {String} directory
         * @returns {Map<String, DataEntry}
         */
    async getDirectoryContents( directory ) {

        const contentsMap = new Map();

        const endpoint = FileManagerAJAXController.endpoints.DIRCONTENTS;
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

            const endpoint = FileManagerAJAXController.endpoints.DIRCREATE;
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
         * @param {File} file 
         * @param {KFUploadToast} uploadToast 
         */
    async uploadFile( file, uploadToast ) {

        const fileData = new FormData();
        fileData.append( "file", file );
        
        const endpoint = FileManagerAJAXController.endpoints.FILEUPLOAD;
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

    async goToHome() {

        this.workingDirectory = "/";
        await this.getWorkingDirectoryContents();

    }

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
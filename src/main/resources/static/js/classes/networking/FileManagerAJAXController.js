import { AJAXController } from "./AJAXController.js";
import { Endpoint } from "../types/networking/Endpoint.js";
import { FileDataEntry } from "../types/entry/FileDataEntry.js";
import { KFUploadToast } from "../types/interface/toasts/KFUploadToast.js";

export class FileManagerAJAXController extends AJAXController {

        /**
         * @override
        */
    static endpoints = {

        DIRCONTENTS: new Endpoint( "/api/dir/contents", Endpoint.httpMethods.GET ),
        CREATEDIR: new Endpoint( "/api/dir", Endpoint.httpMethods.POST ),
        DELETEDIR: new Endpoint( "/api/dir", Endpoint.httpMethods.DELETE ),

        UPLOADFILE: new Endpoint( "/api/file", Endpoint.httpMethods.POST ),
        DUPLICATEFILE: new Endpoint( "api/file/copy", Endpoint.httpMethods.POST ),
        DELETEFILE: new Endpoint( "/api/file", Endpoint.httpMethods.DELETE ),

        RENAMEENTRY: new Endpoint( "/api/entry", Endpoint.httpMethods.PATCH )

    }

    static illegalNameCharacters = "[#%&{}\\<>*?/$!'\":@+`|=]+?";

    constructor() {

        super();

        this.uploadFinishEvent = new CustomEvent( "ajax-upload-finish" );

        this.currentWorkingDirectory = "/";

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
         * @returns {Map<String, FileDataEntry>}
         */
    async getDirectoryContents( directory ) {

        const contentsMap = new Map();

        const endpoint = FileManagerAJAXController.endpoints.DIRCONTENTS;
        const request = endpoint.appendParameters( new URLSearchParams({
            dir: directory
        }));

        await fetch( request, { method: endpoint.method } ).then( async response => {

            if( response.ok ) {

                const JSONData = await response.json();
                const contents = Array.from( JSONData ).map( value => FileDataEntry.fromJSON( value ) );

                contents.forEach( item => contentsMap.set( this.randomEntryID(), item ) );

            } else {
                throw new Error( await response.text() );
            }

        });
        
        return contentsMap;

    }

    async getWorkingDirectoryContents() {
        this.workingDirectoryContents = await this.getDirectoryContents( this.currentWorkingDirectory );
    }

        /**
         * @param {FormData} formData 
         */
    async createDirectory( formData ) {

        const illegalCharacters = "[#%&{}\\<>*?/$!'\":@+`|=]+?";
        const folderName = formData.get( "name" );

        if( folderName.length == 0 ) {
            throw new Error( "Folder name cannot be empty." );
        } else
        if( folderName.match( illegalCharacters ) != null ) {
            throw new Error( "Invalid folder name." );
        } else {

            const endpoint = FileManagerAJAXController.endpoints.CREATEDIR;
            const request = endpoint.appendParameters( new URLSearchParams({
                dir: this.currentWorkingDirectory, dirname: folderName
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
        
        const endpoint = FileManagerAJAXController.endpoints.UPLOADFILE;
        const request = endpoint.appendParameters( new URLSearchParams({
            dir: this.currentWorkingDirectory
        }));

        const xhr = new XMLHttpRequest();
        xhr.open( endpoint.method, request );

        xhr.upload.addEventListener( "progress", (evt) => {

            const complete = ( evt.loaded / evt.total ) * 100;
            uploadToast.setProgressBarValue( complete );

        });

        xhr.addEventListener( "readystatechange", () => {

            if( xhr.readyState == 4 ) {

                if( xhr.status >= 200 && xhr.status < 300 ) {
                    this.dispatchEvent( this.uploadFinishEvent );
                } else {

                    uploadToast.showMessage( xhr.responseText );
                    uploadToast.cancelUpload();

                }

            }

        });        

        uploadToast.addEventListener( "cancel-upload", () => {
            xhr.abort();
        });

        xhr.send( fileData );

    }
    
        /**
         * @param {FileDataEntry} dataEntry
         */
    async duplicateFile( dataEntry ) {

        const endpoint = FileManagerAJAXController.endpoints.DUPLICATEFILE;
        const request = endpoint.appendParameters( new URLSearchParams({
            pathtofile: dataEntry.pathTo
        }));

        await fetch( request, { method: endpoint.method }).then( async response => {

            if( !response.ok ) {
                throw new Error( await response.text() );
            }

        });


    }
    
        /**
         * @param {FileDataEntry} dataEntry
         * @param {FormData} formData   
         */
    async renameEntry( dataEntry, formData ) {

        const newName = formData.get( "newname" );

        if( newName == null || newName.length == 0 ) {
            throw new Error( "New name cannot be empty." )
        } else
        if( newName.match( FileManagerAJAXController.illegalNameCharacters ) != null ) {
            throw new Error( "Invalid name." );
        } else {

            const endpoint = FileManagerAJAXController.endpoints.RENAMEENTRY;
            const request = endpoint.appendParameters( new URLSearchParams({
                pathtoentry: dataEntry.pathTo,
                newname: newName + "." + dataEntry.type
            }));

            await fetch( request, { method: endpoint.method }).then( async response => {

                if( !response.ok ) {
                    throw new Error( await response.text() );
                }

            });

        }

    }

        /**
         * @param {FileDataEntry} dataEntry
         */
    async deleteFile( dataEntry ) {

        const endpoint = FileManagerAJAXController.endpoints.DELETEFILE;
        const request = endpoint.appendParameters( new URLSearchParams({
            pathtofile: dataEntry.pathTo
        }));

        await fetch( request, { method: endpoint.method }).then( async response => {

            if( !response.ok ) {
                throw new Error( await response.text() );
            }

        });

    }

        /**
         * @param {FileDataEntry} dataEntry
         * @param {Boolean} recursively
         */
    async deleteFolder( dataEntry, recursively ) {

        const endpoint = FileManagerAJAXController.endpoints.DELETEDIR;
        const request = endpoint.appendParameters( new URLSearchParams({
            pathtofolder: dataEntry.pathTo,
            recursively: recursively
        }));

        await fetch( request, { method: endpoint.method }).then( async response => {

            if( !response.ok ) {
                throw new Error( await response.text() );
            }

        });

    }

    async goToHome() {

        this.currentWorkingDirectory = "/";
        await this.getWorkingDirectoryContents();

    }

    async goUp() {

        if( this.currentWorkingDirectory != "/" ) {

            let splitDirectories = this.currentWorkingDirectory.split( "/" );
            splitDirectories.pop();

            this.currentWorkingDirectory = 
                splitDirectories.length == 0 ?
                    "/" :                           // if there are no directories above the current one
                    splitDirectories.join( "/" );   // if there are directories ...

            await this.getWorkingDirectoryContents();

        }

    }

}
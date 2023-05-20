import { KFToast } from "../KFToast.js";

export class KFUploadToast extends KFToast {

        /**
         * @param {HTMLDivElement} toastTemplate 
         * @param {String} filename
         * @param {String} destination
         */
    constructor( toastTemplate, filename, destination ) {

        super( toastTemplate, false );        

        this.filename = filename;
        this.destination = destination;

        this.cancelUploadEvent = new CustomEvent( "cancel-upload" );

        this.filenameSpan = this.elementToast.querySelector( "span.__toast_fileupload_filename" );
        this.destinationSpan = this.elementToast.querySelector( "span.__toast_fileupload_destination" );

        this.progressBar = this.elementToast.querySelector( "div.progress-bar.__toast_fileupload_progress" );

        this.uploadCancelButton = this.elementToast.querySelector( "button.__toast_fileupload_cancel" );

        this.filenameSpan.innerText = filename;
        this.destinationSpan.innerText = destination;

        this.uploadCancelButton.addEventListener( 'click', () => this.cancelUpload() ); 

    }

    cancelUpload() {
        
        this.uploadCancelButton.disabled = "true";
        
        this.progressBar.classList.add( "bg-danger" );
        this.progressBar.style.width = "100%";

        this.dispatchEvent( this.cancelUploadEvent );
        setTimeout( this.dispatchEvent( this.disposeEvent ), 5000 );

    }

        /**
         * Updates the toast's progress bar.
         * @param {Number} value The number (between 0 and 1) representing the 
         * completion of the file upload to update the progress bar with.
         */
    onProgress( value ) {

        const percent = Math.round( (value * 100) );
        this.progressBar.style.width = percent + "%";
        this.progressBar.ariaValueNow = percent;

        if( percent == 100 ) {
            
            this.uploadCancelButton.disabled = "true";
            this.progressBar.classList.add( "bg-success" );

            this.dispatchEvent( this.disposeEvent );

        }

    }
    
}
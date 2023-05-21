import { KFToast } from "./KFToast.js";

export class KFUploadToast extends KFToast {

        /**
         * @param {HTMLDivElement} template 
         * @param {String} fileName 
         * @param {String} destination 
         */
    constructor( template, fileName, destination ) {

        super( template, false );

        this.fileName = fileName;
        this.destination = destination;

        this.cancelUploadEvent = new CustomEvent( "toast-cancel-upload" );

            /**
             * @type {HTMLSpanElement}
             */
        this.fileNameText = this.toastElement.querySelector( "span.__toast_fileupload_filename" );

            /**
             * @type {HTMLSpanElement}
             */
        this.destinationText = this.toastElement.querySelector( "span.__toast_fileupload_destination" );
        
            /**
             * @type {HTMLDivElement}
             */
        this.progressBar = this.toastElement.querySelector( "div.progress-bar.__toast_fileupload_progress" );

            /**
             * @type {HTMLButtonElement}
             */
        this.cancelUploadButton = this.toastElement.querySelector( "button.__toast_fileupload_cancel" );
        this.cancelUploadButton.addEventListener( "click", () => this.cancelUpload() );
        
        this.fileNameText.innerText = this.fileName;
        this.destinationText.innerText = this.destination;

    }

    cancelUpload() {

        this.cancelUploadButton.disabled = true;

        this.progressBar.classList.add( "bg-danger" );
        this.progressBar.style.width = "100%";

        this.dispatchEvent( this.cancelUploadEvent );
        setTimeout( this.dispatchEvent( this.disposeEvent ), 5000 );

    }

    setProgressBarValue( value ) {

        this.progressBar.style.width = value + "%";
        this.progressBar.ariaValueNow = value;

        if( value >= 100 ) {

            this.cancelUploadButton.disabled = true;
            this.progressBar.classList.add( "bg-success" );

            this.dispatchEvent( this.disposeEvent );

        }

    }

}
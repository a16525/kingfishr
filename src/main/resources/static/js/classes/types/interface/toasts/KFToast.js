export class KFToast extends EventTarget {

        /**
         * @param {HTMLDivElement} template 
         * @param {Boolean} autohide 
         */
    constructor( template, autohide ) {

        super();

            /**
             * @type {HTMLDivElement}
             */
        this.toastElement = template.cloneNode( true );
        this.bootstrapToast = new bootstrap.Toast( this.toastElement, { "autohide": autohide } );

        this.maximized = true;

        this.hideToastButton = this.toastElement.querySelector( "button.__toast_hide" );
        this.hideToastButton.addEventListener( "click", () => this.toggleDisplay() );

            /**
             * @type {HTMLElement}
             */
        this.toastIcon = this.toastElement.querySelector( "div.toast-header > i.bi" );

            /**
             * @type {HTMLElement}
             */
        this.toastTitle = this.toastElement.querySelector( "div.toast-header > strong" );

            /**
             * @type {HTMLDivElement}
             */
        this.toastContent = this.toastElement.querySelector( "div.toast-body" );

            /**
             * @type {HTMLDivElement}
             */
        this.toastMessagebox = this.toastElement.querySelector( "div.__toast_messagebox" );
        this.toastElement.removeAttribute( "id" );

        this.disposeEvent = new CustomEvent( "toast-dispose" );

    }

    show() {
        this.bootstrapToast.show();
    }

    hide() {
        this.bootstrapToast.hide();
    }

        /**
         * @param {String} messageText
         */
    showMessage( messageText ) {        

        this.toastMessagebox.innerHTML = messageText;
        this.toastMessagebox.classList.remove( "d-none" );

    }

    hideMessage() {

        this.toastMessagebox.classList.add( "d-none" );
        this.toastMessagebox.innerHTML = "";

    }

    maximize() {

        this.toastIcon.classList.remove( "me-3" );
        this.toastIcon.classList.add( "me-1" );

        this.toastElement.classList.remove( "w-auto" );

        this.toastTitle.classList.remove( "d-none" );
        this.toastContent.classList.remove( "d-none" );

    }

    minimize() {

        this.toastIcon.classList.remove( "me-3" );
        this.toastIcon.classList.add( "me-1" );

        this.toastElement.classList.add( "w-auto" );

        this.toastTitle.classList.remove( "d-none" );
        this.toastContent.classList.remove( "d-none" );

    }

    toggleDisplay() {

        if( this.maximized ) {
            this.minimize();
        } else {
            this.maximize();
        }

        this.maximized = !this.maximized;

    }

    dispose() {
        this.dispatchEvent( this.disposeEvent );
    }

    remove() {
        this.toastElement.remove();
    }

}
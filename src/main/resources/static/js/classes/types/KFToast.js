export class KFToast extends EventTarget {

        /**
         * @param {HTMLDivElement} toastTemplate
         * @param {boolean} autohide
         */
    constructor( toastTemplate, autohide ) {

        super();

        this.elementToast = toastTemplate.cloneNode( true );
        this.bootstrapToast = new bootstrap.Toast( this.elementToast, { "autohide": autohide } );

        this.maximized = true;
        this.hideToastButton = this.elementToast.querySelector( "button.__toast_hide" );
        this.hideToastButton.addEventListener( 'click', () => this.toggleDisplay() );

        this.toastIcon = this.elementToast.querySelector( "div.toast-header > i.bi" );
        this.toastTitle = this.elementToast.querySelector( "div.toast-header > strong" );
        this.toastContent = this.elementToast.querySelector( "div.toast-body" );

        this.disposeEvent = new CustomEvent( "dispose" );        

    }
        
        /**
         * Displays the toast.
         */
    show() {
        this.bootstrapToast.show();
    }

        /**
         * Hides the toast.
         */
    hide() {
        this.bootstrapToast.hide();
    }

        /**
         * Toggles between the minimized and maximized state of the toast.
         */
    toggleDisplay() {

        if( this.maximized ) {
            this.minimize();
        } else {
            this.maximize();
        }

        this.maximized = !this.maximized;

    }

        /**
         * Maximizes the toast.
         */
    maximize() {

        this.toastIcon.classList.remove( "me-3" );
        this.toastIcon.classList.add( "me-1" );

        this.elementToast.classList.remove( "w-auto" );

        this.toastTitle.classList.remove( "d-none" );
        this.toastContent.classList.remove( "d-none" );

    }

        /**
         * Minimizes the toast.
         */
    minimize() {

        this.toastIcon.classList.remove( "me-1" );
        this.toastIcon.classList.add( "me-3" );

        this.elementToast.classList.add( "w-auto" );

        this.toastTitle.classList.add( "d-none" );
        this.toastContent.classList.add( "d-none" );

    }

        /**
         * Disposes the toast.
         */
    dispose() {
        this.dispatchEvent( this.disposeEvent );
    }

}
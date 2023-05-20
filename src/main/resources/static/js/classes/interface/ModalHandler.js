export class ModalHandler {

        /**
         * @param {HTMLDivElement} modalParent 
         * @param {HTMLButtonElement} openModalButton         
         */
    constructor( modalParent, openModalButton ) {

        this.modalElement = modalParent;
        this.bootstrapModal = new bootstrap.Modal( this.modalElement );

        this.modalOpenButton = openModalButton;

            /**
             * @type {HTMLButtonElement}
             */
        this.modalCancelButton = this.modalElement.querySelector( "button.__modal_cancel" );

            /**
             * @type {HTMLButtonElement}
             */
        this.modalConfirmButton = this.modalElement.querySelector( "button.__modal_confirm" );
        
            /**
             * @type {HTMLDivElement}
             */
        this.modalMessageBox = this.modalElement.querySelector( "div.__modal_messagebox" );

            /**
             * @type {HTMLInputElement}
             */
        this.modalInput = this.modalElement.querySelector( "form.__modal_form > input" );

            /**
             * @type {HTMLDivElement}
             */
        this.modalForm = this.modalElement.querySelector( "form.__modal_form" );           
        
            // Listeners
        this.modalOpenButton.addEventListener( 'click', () => this.onModalOpen() );
        this.modalCancelButton.addEventListener( 'click', () => this.onModalCancel() );
        this.modalConfirmButton.addEventListener( 'click', () => this.onModalConfirm() );

    }

    onModalOpen() {

        this.modalMessageBox.classList.add( "d-none" );
        this.modalMessageBox.innerHTML = "";

        this.modalCancelButton.disabled = false;
        this.modalConfirmButton.disabled = false;

        this.modalInput.value = "";

        this.bootstrapModal.show();

    }

    onModalCancel() {
        this.bootstrapModal.hide();
    }

        /**
         * @abstract
         */
    onModalConfirm();

    disableButtons() {

        this.modalCancelButton.disabled = true;
        this.modalConfirmButton.disabled = true;

    }

    enableButtons() {

        this.modalCancelButton.disabled = false;
        this.modalConfirmButton.disabled = false;

    }

        /**         
         * @param {string} message 
         */
    showMessage( message ) {

        this.modalMessageBox.innerHTML = message;
        this.modalMessageBox.classList.remove( "d-none" );

    }
    
    hideMessage() {

        this.modalMessageBox.classList.add( "d-none" );
        this.modalMessageBox.innerHTML = "";

    }

}
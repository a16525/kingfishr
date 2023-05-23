export class ModalHandler {

        /**         
         * @param {HTMLDivElement} modalParent 
         * @param {HTMLButtonElement} openModalButton 
         */
    constructor( modalParent, openModalButton ) {

        this.modalElement = modalParent;
        this.bootstrapModal = new bootstrap.Modal( this.modalElement, {} );

        this.modalOpenButton = openModalButton;
        this.modalOpenButton.addEventListener( "click", () => this.onModalOpen() );

            /**
             * @type {HTMLButtonElement}
             */
        this.modalCancelButton = this.modalElement.querySelector( "button.__modal_cancel" );
        this.modalCancelButton.addEventListener( "click", () => this.onModalCancel() );

            /**
             * @type {HTMLButtonElement}
             */
        this.modalConfirmButton = this.modalElement.querySelector( "button.__modal_confirm" );
        this.modalConfirmButton.addEventListener( "click", () => this.onModalConfirm() );

            /**
             * @type {HTMLDivElement}
             */
        this.modalMessageBox = this.modalElement.querySelector( "div.__modal_messagebox" );

            /**
             * @type {HTMLFormElement}
             */
        this.modalForm = this.modalElement.querySelector( "form.__modal_form" );

            /**
             * @type {HTMLInputElement[]}
             */
        this.modalInput = Array.from( this.modalForm.querySelectorAll( "input" ) );

    }

    onModalOpen() {

        this.modalMessageBox.classList.add( "d-none" );
        this.modalMessageBox.innerHTML = "";

        this.modalCancelButton.disabled = false;
        this.modalConfirmButton.disabled = false;

        this.modalInput.forEach( input => input.value = "" );

        this.bootstrapModal.show();

    }

    onModalCancel() {
        this.bootstrapModal.hide();
    }

        /**
         * @abstract
         */
    onModalConfirm() {}

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

    clearInputs() {
        this.modalInput.forEach( input => input.value = "" );
    }

}
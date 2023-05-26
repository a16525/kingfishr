export class ModalHandler {

        /**         
         * @param {HTMLDivElement} modalParent 
         * @param {HTMLButtonElement} openModalButton 
         */
    constructor( modalParent, openModalButton ) {

        this.modalElement = modalParent;
        this.bootstrapModal = new bootstrap.Modal( this.modalElement, {} );

        this.modalOpenButton = openModalButton;
        this.openHandler = () => this.onModalOpen();
        this.modalOpenButton.addEventListener( "click", this.openHandler );

            /**
             * @type {HTMLButtonElement}
             */
        this.modalCancelButton = this.modalElement.querySelector( "button.__modal_cancel" );
        this.cancelHandler = () => this.onModalCancel();
        this.modalCancelButton.addEventListener( "click", this.cancelHandler );

            /**
             * @type {HTMLButtonElement}
             */
        this.modalConfirmButton = this.modalElement.querySelector( "button.__modal_confirm" );
        this.confirmHandler = () => this.onModalConfirm();
        this.modalConfirmButton.addEventListener( "click", this.confirmHandler );

            /**
             * @type {HTMLDivElement}
             */
        this.modalMessageBox = this.modalElement.querySelector( "div.__modal_messagebox" );

            /**
             * @type {HTMLFormElement}
             */
        this.modalForm = this.modalElement.querySelector( "form.__modal_form" );

        if( this.modalForm != null ) {

                /**
                 * @type {HTMLInputElement[]}
                 */
            this.modalInput = Array.from( this.modalForm.querySelectorAll( "input" ) );

        }

    }

    onModalOpen() {

        this.modalMessageBox.classList.add( "d-none" );
        this.modalMessageBox.innerHTML = "";

        this.enableButtons();

        if( this.modalForm != null ) {
            this.modalInput.forEach( input => input.value = "" );
        }

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

        if( this.modalForm != null ) {
            this.modalInput.forEach( input => input.value = "" );
        }

    }

    clearModalListeners() {

        this.modalOpenButton.removeEventListener( "click", this.openHandler );
        this.modalCancelButton.removeEventListener( "click", this.cancelHandler );
        this.modalConfirmButton.removeEventListener( "click", this.confirmHandler );

    }

}
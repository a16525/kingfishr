export class ModalHandler {

        /**
         * 
         * @param {HTMLDivElement} modalParent 
         * @param {HTMLButtonElement} modalOpenButton         
         */
    constructor( modalParent, modalOpenButton ) {

        this.elementModal = modalParent;
        this.bootstrapModal = new bootstrap.Modal( this.elementModal );

        this.modalOpenButton = modalOpenButton;
        this.modalCancelButton = this.elementModal.querySelector( "button.__modal_cancel" );
        this.modalConfirmButton = this.elementModal.querySelector( "button.__modal_confirm" );
        
        this.modalMessageBox = this.elementModal.querySelector( "div.__modal_messagebox" );
        this.modalInput = this.elementModal.querySelector( "form.__modal_form > input" );
        this.modalForm = this.elementModal.querySelector( "form.__modal_form" );           
        
            // Listeners
        this.modalOpenButton.addEventListener( 'click', () => this.onModalOpen() );
        this.modalCancelButton.addEventListener( 'click', () => this.onModalCancel() );
        this.modalConfirmButton.addEventListener( 'click', () => this.onModalConfirm() );

    }

        /**
         * Method executed when the modal opens.
         */
    onModalOpen() {

        this.modalMessageBox.classList.add( "d-none" );
        this.modalMessageBox.innerHTML = "";

        this.modalCancelButton.disabled = false;
        this.modalConfirmButton.disabled = false;

        this.modalInput.value = "";

        this.bootstrapModal.show();

    }

        /**
         * Method executed when the modal cancel button is pressed.
         */
    onModalCancel() {
        this.bootstrapModal.hide();
    }

        /**
         * Method executed when the modal confirm button is pressed (must be defined manually!).
         */
    onModalConfirm() {
        
    }

        /**
         * Disables the modal's buttons.
         */
    disableButtons() {

        this.modalCancelButton.disabled = true;
        this.modalConfirmButton.disabled = true;

    }

        /**
         * Enables the modal's buttons.
         */
    enableButtons() {

        this.modalCancelButton.disabled = false;
        this.modalConfirmButton.disabled = false;

    }

        /**         
         * Displays an error message in the modal.
         * @param {string} message 
         */
    showMessage( message ) {

        this.modalMessageBox.innerHTML = message;
        this.modalMessageBox.classList.remove( "d-none" );

    }

        /**
         * Hides the modal's error message, and erases it's text.
         */
    hideMessage() {

        this.modalMessageBox.classList.add( "d-none" );
        this.modalMessageBox.innerHTML = "";

    }

}
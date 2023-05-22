import { UserManagerAJAXController } from "../classes/networking/UserManagerAJAXController.js";
import { UserActionController } from "../classes/interface/UserActionController.js";
import { DisplayManager } from "../classes/interface/DisplayManager.js";
import { ModalHandler } from "../classes/interface/ModalHandler.js";

let userManagerAjaxController = new UserManagerAJAXController();
let displayManager, userActionController;

function setupCreateUserModal() {

    const modalParent = document.getElementById( "createUserModal" );

        /**
         * @type {HTMLButtonElement}
         */
    const modalOpener = document.querySelector( "button.__action_create_user" );

    const createUserHandler = new ModalHandler( modalParent, modalOpener );

    createUserHandler.onModalConfirm = async () => {

        createUserHandler.hideMessage();
        createUserHandler.disableButtons();

        const formData = new FormData( createUserHandler.modalForm );

        await userManagerAjaxController.createUser( formData ).then( async () => {

            createUserHandler.bootstrapModal.hide();
            await userActionController.getUsers();

        }).catch( error => {

            createUserHandler.enableButtons();
            createUserHandler.showMessage( "An error occurred while creating the user;<br>" + error )

        });

    };

}

function setupDeleteUserModal() {

    const modalParent = document.getElementById( "deleteUserModal" );

        /**
         * @type {HTMLButtonElement}
         */
    const modalOpener = document.querySelector( "button.__action_delete_user" );

    const deleteUserHandler = new ModalHandler( modalParent, modalOpener );

    deleteUserHandler.modalConfirmButton.disabled = true;

    deleteUserHandler.modalInput.addEventListener( "input", () => {

        if( deleteUserHandler.modalInput.value == "Yes, do as I say!" ) {
            deleteUserHandler.modalConfirmButton.disabled = false;
        } else {
            deleteUserHandler.modalConfirmButton.disabled = true;
        }

    });

    deleteUserHandler.onModalConfirm = async () => {

        if( userManagerAjaxController.selectedUser == null ) {
            deleteUserHandler.showMessage( "User must be selected." );
        } else {

            deleteUserHandler.hideMessage();
            deleteUserHandler.disableButtons();

            await userManagerAjaxController.deleteUser( userManagerAjaxController.selectedUser.id ).then( async () => {

                deleteUserHandler.bootstrapModal.hide();
                await userActionController.getUsers();

            }).catch( error => {
                
                deleteUserHandler.showMessage( "An error occurred while deleting the user;<br>" + error );
                deleteUserHandler.enableButtons();
                
                deleteUserHandler.modalConfirmButton.disabled = true;
                deleteUserHandler.modalInput.value = "";

            });

        }

    }

}

document.addEventListener( "DOMContentLoaded", async () => {

        /**
         * @type {HTMLDivElement}
         */
    const attachedElement = document.querySelector( "div.__display_manager_attachment_point" );

        /**
         * @type {HTMLDivElement}
         */
    const actionBar = document.querySelector( "div.__action_bar" );

        /**
         * @type {HTMLDivElement}
         */
    const managementCard = document.querySelector( "div.__userdata_card" );

    displayManager = new DisplayManager( attachedElement );
    userActionController = new UserActionController( displayManager, userManagerAjaxController, actionBar, managementCard );

    setupCreateUserModal();
    setupDeleteUserModal();

    await userActionController.getUsers();

});
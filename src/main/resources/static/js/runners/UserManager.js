import { UserManagerAJAXController } from "../classes/networking/UserManagerAJAXController.js";
import { UserActionController } from "../classes/interface/UserActionController.js";
import { DisplayManager } from "../classes/interface/DisplayManager.js";
import { ModalHandler } from "../classes/interface/ModalHandler.js";
import { SearchAgent } from "../classes/interface/SearchAgent.js";

    /**
     * @type {UserManagerAJAXController}
     */
let userManagerAjaxController = new UserManagerAJAXController();

    /**
     * @type {DisplayManager}
     */
let displayManager; 

    /**
     * @type {UserActionController}
     */
let userActionController; 

    /**
     * @type {SearchAgent}
     */
let searchAgent;

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
            createUserHandler.clearInputs();

            await userActionController.getUsers();

        }).catch( error => {

            createUserHandler.enableButtons();
            createUserHandler.showMessage( "An error occurred while creating the user;<br>" + error )

        });

    };

}

function setupRenameUserModal() {

    const modalParent = document.getElementById( "renameUserModal" );

        /**
         * @type {HTMLButtonElement}
         */
    const modalOpener = document.querySelector( "button.__action_rename_user" );

    const renameUserHandler = new ModalHandler( modalParent, modalOpener );

    renameUserHandler.onModalConfirm = async () => {

        renameUserHandler.hideMessage();
        renameUserHandler.disableButtons();

        const formData = new FormData( renameUserHandler.modalForm );

        await userManagerAjaxController.renameUser( userManagerAjaxController.selectedUser, formData ).then( async () => {

            renameUserHandler.bootstrapModal.hide();
            
            await userActionController.getUsers();

        }).catch( error => {

            renameUserHandler.enableButtons();
            renameUserHandler.showMessage( "An error occurred while renaming the user;<br>" + error )

        });

    };

}

function setupChangeUserPasswordModal() {

    const modalParent = document.getElementById( "changeUserPasswordModal" );

        /**
         * @type {HTMLButtonElement}
         */
    const modalOpener = document.querySelector( "button.__action_change_user_password" );

    const changeUserPasswordHandler = new ModalHandler( modalParent, modalOpener );

    changeUserPasswordHandler.onModalConfirm = async () => {

        changeUserPasswordHandler.hideMessage();
        changeUserPasswordHandler.disableButtons();

        const formData = new FormData( changeUserPasswordHandler.modalForm );

        await userManagerAjaxController.changeUserPassword( userManagerAjaxController.selectedUser, formData ).then( async () => {

            changeUserPasswordHandler.bootstrapModal.hide();
            changeUserPasswordHandler.clearInputs();

            await userActionController.getUsers();

        }).catch( error => {

            changeUserPasswordHandler.enableButtons();
            changeUserPasswordHandler.showMessage( "An error occurred while changing the user's password;<br>" + error )

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

    modalOpener.addEventListener( "click", () => deleteUserHandler.modalConfirmButton.disabled = true );

    deleteUserHandler.modalInput[0].addEventListener( "input", () => {

        if( deleteUserHandler.modalInput[0].value == "Yes, do as I say!" ) {
            deleteUserHandler.modalConfirmButton.disabled = false;
        } else {
            deleteUserHandler.modalConfirmButton.disabled = true;
        }

    });

    deleteUserHandler.onModalConfirm = async () => {

        deleteUserHandler.hideMessage();
        deleteUserHandler.disableButtons();

        await userManagerAjaxController.deleteUser( userManagerAjaxController.selectedUser ).then( async () => {

            deleteUserHandler.bootstrapModal.hide();
            await userActionController.getUsers();

        }).catch( error => {
            
            deleteUserHandler.showMessage( "An error occurred while deleting the user;<br>" + error );
            deleteUserHandler.enableButtons();
            
            deleteUserHandler.modalConfirmButton.disabled = true;
            deleteUserHandler.modalInput[0].value = "";

        });        

    }

}

document.addEventListener( "DOMContentLoaded", async () => {

    window.addEventListener( "scroll", () => { displayManager.updateHeight() })
    window.addEventListener( "resize", () => { displayManager.updateHeight() })

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
    searchAgent = new SearchAgent();

    setupCreateUserModal();
    setupRenameUserModal();
    setupChangeUserPasswordModal();
    setupDeleteUserModal();

    userActionController.getUsers();

});
import { FileManagerAJAXController } from "../classes/networking/FileManagerAJAXController.js";
import { ModalHandler } from "../classes/interface/ModalHandler.js";
import { ActionController } from "../classes/interface/ActionController.js";
import { KFUploadToast } from "../classes/types/toasts/KFUploadToast.js";
import { SchemableDisplayManager } from "../classes/interface/SchemableDisplayManager.js";

let fileManagerAjaxController = new FileManagerAJAXController();
let schemableDisplayManager, actionController, toastManager;

function setupHeightUpdateForcers() {

    window.addEventListener( "scroll", () => schemableDisplayManager.updateTableHeight() );
    window.addEventListener( "resize", () => schemableDisplayManager.updateTableHeight() );

    const storageForceUpdateElements = Array.from( document.getElementsByClassName( "__storage_forceupdate" ) );

    storageForceUpdateElements.forEach( element => {
        element.addEventListener( "click", () => schemableDisplayManager.updateTableHeight() );
    });

}

function setupCreateDirectoryModal() {

    const modalParent = document.getElementById( "folderModal" );

        /**
         * @type {HTMLButtonElement}
         */
    const modalOpener = document.querySelector( "button.__nav_create_mkdir" );

    const createDirectoryHandler = new ModalHandler( modalParent, modalOpener );

    createDirectoryHandler.onModalConfirm = async () => {

        createDirectoryHandler.hideMessage();
        createDirectoryHandler.disableButtons();

        const formData = new FormData( createDirectoryHandler.modalForm );

        await fileManagerAjaxController.createDirectory( formData ).then( async () => {

            createDirectoryHandler.bootstrapModal.hide();
            actionController.refreshDirectoryContents();

        }).catch( error => {

            createDirectoryHandler.enableButtons();
            createDirectoryHandler.showMessage( "An error occurred while creating the folder;<br>" + error );

        });

    };

}

function setupUploadFilesModal() {

    const modalParent = document.getElementById( "uploadModal" );

        /**
         * @type {HTMLButtonElement}
         */
    const modalOpener = document.querySelector( "button.__nav_create_upload" );

    const uploadFilesHandler = new ModalHandler( modalParent, modalOpener );

    uploadFilesHandler.onModalConfirm = async () => {

        const files = Array.from( uploadFilesHandler.modalInput.files );

        if( files.length == 0 ) {
            uploadFilesHandler.showMessage( "Must select files(s) to be uploaded." );
        } else {

            uploadFilesHandler.bootstrapModal.hide();

            const uploadToastTemplate = document.getElementById( "fileUploadToast" );

            files.forEach( file => {

                const destination = fileManagerAjaxController.workingDirectory == "/" ?
                                        "Home":
                                        "Home/" + fileManagerAjaxController.workingDirectory;
                //

                const toast = new KFUploadToast( uploadToastTemplate, file.name, destination );

                const toastID = toastManager.trackToast( toast );
                fileManagerAjaxController.uploadFile( file, toast );

                toastManager.showToast( toastID );

            });

        }

    };

}

document.addEventListener( "DOMContentLoaded", async () => {

        /**
         * @type {HTMLDivElement}
         */
    const attachedElement = document.querySelector( "div.__display_manager_attachment_point" );

        /**
         * @type {HTMLDivElement}
         */
    const navigationBar = document.querySelector( "div.__navigation_component" );

        /**
         * @type {HTMLDivElement}
         */
    const navigationToggleSchemeButton = document.querySelector( "button.__nav_toggle_scheme" );

        /**
         * @type {HTMLDivElement}
         */
    const toastContainer = document.querySelector( "div.toast-container" );

    schemableDisplayManager = new SchemableDisplayManager( SchemableDisplayManager.schemes.LIST, attachedElement, navigationToggleSchemeButton );
    actionController = new ActionController( schemableDisplayManager, fileManagerAjaxController, navigationBar );
    toastManager = new KFToastManager( toastContainer );

    setupHeightUpdateForcers();

    setupCreateDirectoryModal();
    setupUploadFilesModal();

    actionController.refreshDirectoryContents();

});
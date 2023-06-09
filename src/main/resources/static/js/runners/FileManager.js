import { FileManagerAJAXController } from "../classes/networking/FileManagerAJAXController.js";
import { ModalHandler } from "../classes/interface/ModalHandler.js";
import { KFUploadToast } from "../classes/types/interface/toasts/KFUploadToast.js";
import { SchemeableDisplayManager } from "../classes/interface/SchemeableDisplayManager.js";
import { FileActionController } from "../classes/interface/FileActionController.js";
import { KFToastManager } from "../classes/interface/KFToastManager.js";

    /**
     * @type {FileManagerAJAXController}
     */
let fileManagerAjaxController = new FileManagerAJAXController();

    /**
     * @type {SchemeableDisplayManager}
     */
let schemeableDisplayManager;

    /**
     * @type {FileActionController}
     */
let fileActionController;

    /**
     * @type {KFToastManager}
     */
let toastManager;

function setupHeightUpdateForcers() {

    window.addEventListener( "scroll", () => schemeableDisplayManager.updateHeight() );
    window.addEventListener( "resize", () => schemeableDisplayManager.updateHeight() );

    const storageForceUpdateElements = Array.from( document.getElementsByClassName( "__storage_forceupdate" ) );

    storageForceUpdateElements.forEach( element => {
        element.addEventListener( "click", () => schemeableDisplayManager.updateHeight() );
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
            await fileActionController.refreshView();

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

        const files = Array.from( uploadFilesHandler.modalInput[0].files );

        if( files.length == 0 ) {
            uploadFilesHandler.showMessage( "Must select files(s) to be uploaded." );
        } else {

            uploadFilesHandler.bootstrapModal.hide();

            const uploadToastTemplate = document.getElementById( "fileUploadToast" );
            let uploadRefresh;

            files.forEach( file => {

                const destination = fileManagerAjaxController.currentWorkingDirectory == "/" ?
                                        "Home":
                                        "Home/" + fileManagerAjaxController.currentWorkingDirectory;
                //

                const toast = new KFUploadToast( uploadToastTemplate, file.name, destination );

                const toastID = toastManager.trackToast( toast );                
                fileManagerAjaxController.uploadFile( file, toast )

                toastManager.showToast( toastID );

            });

            const oldUploadDirectory = fileManagerAjaxController.currentWorkingDirectory;
            let uploadFinishReload = null;

            fileManagerAjaxController.addEventListener( "ajax-upload-finish", async () => {                    

                if( oldUploadDirectory == fileManagerAjaxController.currentWorkingDirectory ) {
                    
                    if( uploadFinishReload != null ) {
                        clearTimeout( uploadFinishReload );                        
                    }

                    uploadFinishReload = setTimeout( async () => { 
                        await fileActionController.refreshView();
                    }, 500 );

                }

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
    const navigationToggleSchemeButton = document.querySelector( "button.__nav_toggle_scheme" );

        /**
         * @type {HTMLDivElement}
         */
    const toastContainer = document.querySelector( "div.toast-container" );

    schemeableDisplayManager = new SchemeableDisplayManager( SchemeableDisplayManager.schemes.LIST, attachedElement, navigationToggleSchemeButton );
    fileActionController = new FileActionController( schemeableDisplayManager, fileManagerAjaxController );
    toastManager = new KFToastManager( toastContainer );

    setupHeightUpdateForcers();

    setupCreateDirectoryModal();
    setupUploadFilesModal();

    await fileActionController.refreshView();
    
});
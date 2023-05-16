import { AJAXController }       from "./classes/network/AJAXController.js";
import { DisplayManager }       from "./classes/interface/DisplayManager.js";
import { ModalHandler }         from "./classes/interface/ModalHandler.js";
import { ViewController }       from "./classes/interface/ViewController.js";
import { KFToastManager }       from "./classes/interface/KFToastManager.js";
import { KFUploadToast }        from "./classes/types/toasts/KFUploadToast.js";

let ajaxController = new AJAXController(), displayManager, viewController, toastManager;

function setupHeightUpdateForcers() {

    const storageForceUpdate = document.getElementsByClassName( "__storage_forceupdate" );

    window.addEventListener( "scroll", () => displayManager.updateTableHeight() );
    window.addEventListener( "resize", () => displayManager.updateTableHeight() );   

    const forceUpdateHeightElements = Array.from( storageForceUpdate );

    forceUpdateHeightElements.forEach( element => {
        element.addEventListener( "click", () => displayManager.updateTableHeight() );
    });

}

function setupCreateDirectoryModal() {

    const modalParent = document.getElementById( "folderModal" );
    const modalOpener = document.getElementsByClassName( "__nav_create_mkdir" )[0];

    const createDirectoryHandler = new ModalHandler( modalParent, modalOpener );

    createDirectoryHandler.onModalConfirm = async () => {

        createDirectoryHandler.hideMessage();
        createDirectoryHandler.disableButtons();

        const formData = new FormData( createDirectoryHandler.modalForm );
        await ajaxController.createDirectory( formData ).then( async () => {
            
            createDirectoryHandler.bootstrapModal.hide();

            await ajaxController.getWorkingDirectoryContents();
            displayManager.updateView( ajaxController.workingDirectoryContents );            

        }).catch( error => {

            createDirectoryHandler.enableButtons();
            createDirectoryHandler.showMessage( "An error occurred while creating the folder;<br>" + error );

        });

    };

}

function setupUploadFoldersModal() {

    const modalParent = document.getElementById( "uploadModal" );
    const modalOpener = document.getElementsByClassName( "__nav_create_upload" )[0];

    const uploadFilesHandler = new ModalHandler( modalParent, modalOpener );

    uploadFilesHandler.onModalConfirm = async () => {

        const files = Array.from( uploadFilesHandler.modalInput.files );
        if( files.length == 0 ) {
            uploadFilesHandler.showMessage( "Must select file(s) to be uploaded." );
        } else {

            uploadFilesHandler.bootstrapModal.hide();          
            const uploadToastTemplate = document.getElementById( "fileUploadToast" );

            files.forEach( file => {

                const toast = new KFUploadToast( uploadToastTemplate, 
                                                file.name, 
                                                ajaxController.workingDirectory == "/" ? 
                                                    "Home" : 
                                                    "Home/" + ajaxController.workingDirectory );
                //

                const toastID = toastManager.trackToast( toast );
                ajaxController.uploadFile( file, toast );
                
                toastManager.showToast( toastID );

            });

            // TO-DO: Multiupload toast

        }

    };

}

document.addEventListener( "DOMContentLoaded", async () => {

        // Display managing
    const attachedElement = document.getElementsByClassName( "__views_storage_container" )[0];
    const navBar = document.getElementsByClassName( "__navigation_component" )[0];
    const navToggleScheme = document.getElementsByClassName( "__nav_toggle_scheme" )[0];
    const toastContainer = document.getElementsByClassName( "toast-container" )[0];

    displayManager = new DisplayManager( DisplayManager.schemes.LIST, attachedElement, navToggleScheme );
    viewController = new ViewController( displayManager, ajaxController, navBar );
    toastManager = new KFToastManager( toastContainer );

    setupHeightUpdateForcers();

        // Modals
    setupCreateDirectoryModal();
    setupUploadFoldersModal();

        // Initial gathering
    await ajaxController.getWorkingDirectoryContents();

    displayManager.updateView( ajaxController.workingDirectoryContents );
    viewController.updateBreadcrumb();

});
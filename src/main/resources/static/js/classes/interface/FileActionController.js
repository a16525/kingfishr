import { ActionController } from "./ActionController.js";
import { DisplayManager } from "./DisplayManager.js";
import { FileManagerAJAXController } from "../networking/FileManagerAJAXController.js";
import { SchemeableDisplayManager } from "./SchemeableDisplayManager.js";
import { FileDataEntry } from "../types/entry/FileDataEntry.js";
import { ModalHandler } from "../interface/ModalHandler.js";

export class FileActionController extends ActionController {

        /**
         * @param {DisplayManager} displayManager 
         * @param {FileManagerAJAXController} fileManagerAjaxController 
         * @param {HTMLDivElement} navigationBar 
         */
    constructor( displayManager, fileManagerAjaxController ) {

        super( displayManager );

        this.fileManagerAjaxController = fileManagerAjaxController;

            /**
             * @type {HTMLDivElement}
             */
        this.breadcrumb = document.querySelector( "nav > ol.breadcrumb" );

            /**
             * @type {HTMLButtonElement}
             */
        this.upButton = document.querySelector( "button.__nav_back" );
        this.upButton.addEventListener( "click", () => this.navigateUp() );

            /**
             * @type {HTMLButtonElement}
             */
        this.homeButton = document.querySelector( "button.__nav_home" );
        this.homeButton.addEventListener( "click", () => this.navigateHome() );

            /**
             * @type {HTMLButtonElement}
             */
        this.refreshButton = document.querySelector( "button.__nav_refresh" );
        this.refreshButton.addEventListener( "click", () => this.refreshView() );

        window.addEventListener( "click", (evt) => this.getContextFromClick( evt ) );

    }

    updateBreadcrumb() {

        this.breadcrumb.innerHTML = "";

        let splitDirectories = [];

        if( this.fileManagerAjaxController.currentWorkingDirectory != "/" ) {
            splitDirectories = this.fileManagerAjaxController.currentWorkingDirectory.split( "/" );
        }

        const rootBreadcrumbItem = document.createElement( "li" );
        rootBreadcrumbItem.classList.add( "breadcrumb-item" );

        if( splitDirectories.length == 0 ) {

            rootBreadcrumbItem.classList.add( "active" );
            rootBreadcrumbItem.innerText = "Home";

        } else {

            const rootBreadcrumbItemLink = document.createElement( "a" );

            rootBreadcrumbItemLink.dataset.pathto = "/";
            rootBreadcrumbItemLink.innerText = "Home";
            rootBreadcrumbItemLink.href = "#";

            rootBreadcrumbItem.appendChild( rootBreadcrumbItemLink );

        }

        this.breadcrumb.appendChild( rootBreadcrumbItem );

        splitDirectories.forEach( ( directory, index ) => {

            const breadcrumbItem = document.createElement( "li" );
            breadcrumbItem.classList.add( "breadcrumb-item" );

            if( index == splitDirectories.length - 1 ) {

                breadcrumbItem.classList.add( "active" );
                breadcrumbItem.innerText = directory;

            } else {

                const breadcrumbItemLink = document.createElement( "a" );
                breadcrumbItemLink.innerText = directory;

                const pathTo = splitDirectories.slice( 0, index + 1 ).join( "/" );
                breadcrumbItemLink.dataset.pathto = pathTo;

                breadcrumbItemLink.href = "#";

                breadcrumbItem.appendChild( breadcrumbItemLink );

            }

            this.breadcrumb.appendChild( breadcrumbItem );

        });

    }

        /**
         * @param {MouseEvent} evt
         */
    getContextFromClick( evt ) {

            /**
             * @type {HTMLElement?}
             */
        const target = evt.target;
        const targetTag = target.tagName.toLowerCase();

            /**
             * @type {SchemeableDisplayManager}
             */
        const schemeableDisplayManager = this.displayManager;   

        switch( targetTag ) {

            case "i": case "button":

                let isPropertiesButton = targetTag == "i" ?
                    target.parentElement.classList.contains( "__entry_properties" ) :
                    target.classList.contains( "__entry_properties" );

                if( isPropertiesButton ) {

                    switch( schemeableDisplayManager.scheme ) {

                        case SchemeableDisplayManager.schemes.LIST:
                            this.handlePropertiesClick( evt, false );
                        break;

                        case SchemeableDisplayManager.schemes.GRID:
                            this.handlePropertiesClick( evt, true );
                        break;

                    }

                } 

            break;

            case "a":
                this.handleBreadcrumbClick( evt );
            break;

        }

    }

        /**
         * 
         * @param {MouseEvent} evt 
         * @param {Boolean} isGridLayout 
         */
    handlePropertiesClick( evt, isGridLayout ) {

            /**
             * @type {HTMLElement}
             */
        const target = evt.target;
        const targetTag = target.tagName.toLowerCase();

        let button = targetTag == "button" ? target : target.parentElement;
        let dataElement = target;

        if( isGridLayout ) {

            switch( targetTag ) {

                case "i":
                    for( let i = 0; i < 4; i++ ) dataElement = dataElement.parentElement;
                break;
    
                case "button":
                    for( let i = 0; i < 3; i++ ) dataElement = dataElement.parentElement;
                break;
    
            }

            dataElement = dataElement.querySelector( "button.__card_click_captor.data_entry" );

        } else {

            switch( targetTag ) {

                case "i":
                    for( let i = 0; i < 3; i++ ) dataElement = dataElement.parentElement;
                break;
    
                case "button":
                    for( let i = 0; i < 2; i++ ) dataElement = dataElement.parentElement;
                break;
    
            }

        }

        if( dataElement.classList.contains( "data_entry" ) ) {

            const entryID = dataElement.dataset.entryid;

            if( this.fileManagerAjaxController.workingDirectoryContents.has( entryID ) ) {

                const entry = this.fileManagerAjaxController.workingDirectoryContents.get( entryID );

                if( entry.type == "dir" ) {
                    this.showDropdown( button, entry, "div.__dropdowns > ul.__dropdown_context_folder" );
                } else {
                    this.showDropdown( button, entry, "div.__dropdowns > ul.__dropdown_context_file" );
                }

            }

        }

    }

        /**
         * 
         * @param {HTMLButtonElement} button 
         * @param {FileDataEntry} entry
         * @param {String} querySelector 
         */
    showDropdown( button, entry, querySelector ) {

            /**
             * @type {HTMLUListElement}
             */
        const dropdownElement = document.querySelector( querySelector ).cloneNode( true );
        const dropdownParent = button.parentElement;
        
        const renameOption = dropdownElement.querySelector( ".__rename_option" );
        if( renameOption != null ) {

            renameOption.addEventListener( "click", () => {

                const modalElement = document.getElementById( "renameModal" );
                const renameHandler = new ModalHandler( modalElement, renameOption );

                renameHandler.onModalConfirm = async () => {

                    renameHandler.hideMessage();
                    renameHandler.disableButtons();

                    const formData = new FormData( renameHandler.modalForm );

                    await this.fileManagerAjaxController.renameEntry( entry, formData ).then( async () => {

                        renameHandler.bootstrapModal.hide();
                        await this.refreshView();

                        renameHandler.clearModalListeners();

                    }).catch( error => {

                        renameHandler.showMessage( "An error occurred while renaming the entry;<br>" + error );
                        renameHandler.enableButtons(); 

                    });

                };

                renameHandler.onModalOpen();

            });

        }

        const deleteOption = dropdownElement.querySelector( ".__delete_option" );
        if( deleteOption != null ) {

            deleteOption.addEventListener( "click", () => {

                let modalElement;

                if( entry.type == "dir" ) {
                    modalElement = document.getElementById( "deleteFolderModal" );
                } else {
                    modalElement = document.getElementById( "deleteFileModal" );
                }
    
                const deleteHandler = new ModalHandler( modalElement, deleteOption );
                
                deleteHandler.onModalConfirm = async () => {
    
                    deleteHandler.hideMessage();
                    deleteHandler.disableButtons();
    
                    if( entry.type == "dir" ) {
    
                        const formData = new FormData( deleteHandler.modalForm );
    
                        const checkboxValue = formData.get( "deleteRecursivelyCheckbox" );
                        const deleteRecursively = checkboxValue != null;
    
                        await this.fileManagerAjaxController.deleteFolder( entry, deleteRecursively ).then( async () => {
                            
                            deleteHandler.bootstrapModal.hide();
                            await this.refreshView();
    
                            deleteHandler.clearModalListeners();

                        }).catch( error => {
    
                            deleteHandler.showMessage( "An error occurred while deleting the folder;<br>" + error );
                            deleteHandler.enableButtons();
    
                        });
    
                    } else {
    
                        await this.fileManagerAjaxController.deleteFile( entry ).then( async () => {
    
                            deleteHandler.bootstrapModal.hide();
                            await this.refreshView();

                            deleteHandler.clearModalListeners();
    
                        }).catch( error => {
    
                            deleteHandler.showMessage( "An error occurred while deleting the file;<br>" + error );
                            deleteHandler.enableButtons();
    
                        });
    
                    }
    
                };
                
                deleteHandler.onModalOpen();

            });

        }

        const downloadOption = dropdownElement.querySelector( ".__download_option" );
        if( downloadOption != null ) {

            downloadOption.addEventListener( "click", () => {

                const download = document.createElement( "a" );
                download.href = "/api/file?pathtofile=" + entry.pathTo;
    
                document.body.appendChild( download );
                download.click();
                document.body.removeChild( download );

            });

        }

        const duplicateOption = dropdownElement.querySelector( ".__duplicate_option" );
        if( duplicateOption != null ) {

            duplicateOption.addEventListener( "click", async () => {

                await this.fileManagerAjaxController.duplicateFile( entry );
                await this.refreshView();

            });

        }

        const openOption = dropdownElement.querySelector( ".__open_option" );
        if( openOption != null ) {

            openOption.addEventListener( "click", async () => {

                this.fileManagerAjaxController.currentWorkingDirectory = entry.pathTo;
                await this.refreshView();
    
                this.updateBreadcrumb();

            });

        }

        button.setAttribute( "data-bs-toggle", "dropdown" );
        dropdownParent.appendChild( dropdownElement );
        dropdownElement.classList.remove( "d-none" );

        const bootstrapDropdown = new bootstrap.Dropdown( dropdownElement, { reference: button } );

            // hacky fix to remove dropdown because Dropdown.autoClose wasn't working
        const removeDropdown = () => {

            button.removeAttribute( "data-bs-toggle", "dropdown" );
            dropdownElement.remove();

            document.removeEventListener( "click", () => removeDropdown() )

        }

        document.addEventListener( "click", () => removeDropdown() );

        bootstrapDropdown.show();

    }

        /**
         * @param {MouseEvent} evt
        */
    async handleBreadcrumbClick( evt ) {

            /**
             * @type {HTMLElement?}
             */
        const targetElement = evt.target;
        const breadcrumbListItemElement = targetElement.parentElement;

        if( breadcrumbListItemElement.classList.contains( "breadcrumb-item" ) ) {

            const newWorkingDirectory = evt.target.dataset.pathto;

            this.fileManagerAjaxController.currentWorkingDirectory = newWorkingDirectory;
            await this.refreshView();

            this.updateBreadcrumb();

        }

    }

    async navigateUp() {

        await this.fileManagerAjaxController.goUp();

        this.displayManager.updateView( this.fileManagerAjaxController.workingDirectoryContents );
        this.updateBreadcrumb();

    }

    async navigateHome() {

        if( this.fileManagerAjaxController.currentWorkingDirectory != "/" ) {

            await this.fileManagerAjaxController.goToHome();

            this.displayManager.updateView( this.fileManagerAjaxController.workingDirectoryContents );
            this.updateBreadcrumb();

        }

    }

    async refreshView() {

        await this.fileManagerAjaxController.getWorkingDirectoryContents();
        this.displayManager.updateView( this.fileManagerAjaxController.workingDirectoryContents );

        this.updateBreadcrumb();

    }

}
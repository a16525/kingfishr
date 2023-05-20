import { DisplayManager } from "./DisplayManager.js";
import { FileManagerAJAXController } from "../networking/FileManagerAJAXController.js";

export class ActionController {

        /**
         * @param {DisplayManager} displayManager 
         * @param {FileManagerAJAXController} fileManagerAjaxController 
         * @param {HTMLDivElement} navigationBar 
         */
    constructor( displayManager, fileManagerAjaxController, navigationBar ) {

        this.displayManager = displayManager;
        this.fileManagerAjaxController = fileManagerAjaxController;

            /**
             * @type {HTMLDivElement}
             */
        this.breadcrumb = navigationBar.querySelector( "nav > ol.breadcrumb" );

            /**
             * @type {HTMLButtonElement}
             */
        this.backbutton = navigationBar.querySelector( "button.__nav_back" );

            /**
             * @type {HTMLButtonElement}
             */
        this.homeButton = navigationBar.querySelector( "button.__nav_home" );

            /**
             * @type {HTMLButtonElement}
             */
        this.refreshButton = navigationBar.querySelector( "button.__nav_refresh" );

        window.addEventListener( "click", getContextFromClick );

        this.backbutton.addEventListener( "click", () => this.navigateUp() );
        this.homeButton.addEventListener( "click", () => this.navigateHome() );
        this.refreshButton.addEventListener( "click", () => this.refreshView() );

    }

    updateBreadcrumb() {

        this.breadcrumb.innerHTML = "";

        let splitDirectories = [];

        if( this.ajaxController.workingDirectory != "/" ) {
            splitDirectories = this.ajaxController.workingDirectory.split( "/" );
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
             * @type {HTMLElement}
             */
        const targetElement = evt.target;
        const targetElementTag = targetElement.tagName.toLowerCase();

        switch( targetElementTag ) {

            case "td":
                this.handleEntryClick( evt );
            break;

            case "a":
                this.handleBreadcrumbClick( evt );
            break;

        }

    }

        /**
         * @param {MouseEvent} evt
         */
    async handleEntryClick( evt ) {

            /**
             * @type {HTMLElement?}
             */
        const targetElement = evt.target;
        const dataElement = targetElement.parentElement;

        if( dataElement.classList.contains( "data_entry" ) ) {

            const entryID = dataElement.dataset.entryid;

            if( this.fileManagerAjaxController.workingDirectoryContents.has( entryID ) ) {

                const entry = this.fileManagerAjaxController.workingDirectoryContents.get( entryID );

                if( entry.type == "dir" ) {

                    this.fileManagerAjaxController.workingDirectory = entry.pathTo;
                    await this.fileManagerAjaxController.getWorkingDirectoryContents();

                    this.displayManager.updateView( this.fileManagerAjaxController.workingDirectoryContents );
                    this.updateBreadcrumb();

                }

            } 

        }

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
            this.fileManagerAjaxController.workingDirectory = newWorkingDirectory;

            await this.ajaxController.getWorkingDirectoryContents();

            this.displayManager.updateView( this.fileManagerAjaxController.workingDirectoryContents );
            this.updateBreadcrumb();

        }

    }

    async navigateUp() {

        await this.fileManagerAjaxController.goUp();

        this.displayManager.updateView( this.fileManagerAjaxController.workingDirectoryContents );
        this.updateBreadcrumb();

    }

    async navigateHome() {

        if( this.fileManagerAjaxController.workingDirectory != "/" ) {

            await this.fileManagerAjaxController.goToHome();

            this.displayManager.updateView( this.fileManagerAjaxController.workingDirectoryContents );
            this.updateBreadcrumb();

        }

    }

    async refreshDirectoryContents() {

        await this.fileManagerAjaxController.getWorkingDirectoryContents();
        this.displayManager.updateView( this.fileManagerAjaxController.getWorkingDirectoryContents );

    }

}
import { AJAXController } from "../network/AJAXController.js";
import { DisplayManager } from "./DisplayManager.js";

class ViewController {

        /**
         * @param {DisplayManager} displayManager
         * @param {AJAXController} ajaxController
         * @param {HTMLDivElement} navBar
         */
    constructor( displayManager, ajaxController, navBar ) {

        this.displayManager = displayManager;
        this.ajaxController = ajaxController;

        this.breadcrumb = navBar.querySelector( "nav > ol.breadcrumb" );

        this.backButton = navBar.querySelector( ".__nav_back" );
        this.homeButton = navBar.querySelector( ".__nav_home" );
        this.refreshButton = navBar.querySelector( ".__nav_refresh" );

        window.addEventListener( 'click', (evt) => this.getContextFromClick( evt ) );

        this.backButton.addEventListener( 'click', () => this.navigateUp() );
        this.homeButton.addEventListener( 'click', () => this.navigateHome() );
        this.refreshButton.addEventListener( 'click', () => this.refreshDirectoryContents() );

    }

        /**
         * Updates the breadcrumb based on the ajaxController working directory.
         */
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
         * Obtains the context of where the mouse was clicked.
         * @param {MouseEvent} evt 
         */
    getContextFromClick( evt ) {

        const targetElementTag = evt.target.tagName.toLowerCase();

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
         * Handles the right-click for a data entry.
         * @param {MouseEvent} evt 
         */
    async handleEntryClick( evt ) {

        const dataElement = evt.target.parentElement;        

        if( dataElement.classList.contains( "data_entry" ) ) {

            const entryID = dataElement.dataset.entryid;

            if( this.ajaxController.workingDirectoryContents.has( entryID ) ) {

                const entry = this.ajaxController.workingDirectoryContents.get( entryID );
                
                if( entry.type == "dir" ) {

                    this.ajaxController.workingDirectory = entry.pathTo;
                    await this.ajaxController.getWorkingDirectoryContents();

                    this.displayManager.updateView( this.ajaxController.workingDirectoryContents );
                    this.updateBreadcrumb();

                }

            }

        }

    }

        /**
         * Handles the right-click for a breadcrumb link.
         * @param {MouseEvent} evt
         */
    async handleBreadcrumbClick( evt ) {

        const breadcrumbLIElement = evt.target.parentElement;

        if( breadcrumbLIElement.classList.contains( "breadcrumb-item" ) ) {
           
            const newWorkingDirectory = evt.target.dataset.pathto;
            this.ajaxController.workingDirectory = newWorkingDirectory;

            await this.ajaxController.getWorkingDirectoryContents();

            this.displayManager.updateView( this.ajaxController.workingDirectoryContents );
            this.updateBreadcrumb();

        }

    }

        /**
         * Calls AJAXController.goUp() and updates the view.
         */
    async navigateUp() {

        await this.ajaxController.goUp();

        this.displayManager.updateView( this.ajaxController.workingDirectoryContents );
        this.updateBreadcrumb();

    }

        /**
         * Calls AJAXController.goToHome() and updates the view.
         */
    async navigateHome() {

        if( this.ajaxController.workingDirectory != "/" ) {

            await this.ajaxController.goToHome();

            this.displayManager.updateView( this.ajaxController.workingDirectoryContents );
            this.updateBreadcrumb();

        }

    }

        /**
         * Updates the view.
         */
    async refreshDirectoryContents() {

        await this.ajaxController.getWorkingDirectoryContents();
        this.displayManager.updateView( this.ajaxController.workingDirectoryContents );

    }

}

export { ViewController as NavigationController }
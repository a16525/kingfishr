import { ActionController } from "./ActionController.js";
import { DisplayManager } from "./DisplayManager.js";
import { UserManagerAJAXController } from "../networking/UserManagerAJAXController.js";

export class UserActionController extends ActionController {

        /**
         * @param {DisplayManager} displayManager
         * @param {UserManagerAJAXController} userManagerAjaxController
         * @param {HTMLDivElement} actionBar
         * @param {HTMLDivElement} managementCard
         */
    constructor( displayManager, userManagerAjaxController, actionBar, managementCard ) {

        super( displayManager );

        this.userManagerAjaxController = userManagerAjaxController;
        this.actionBar = actionBar;

        this.managementCard = managementCard;

            /**
             * @type {HTMLButtonElement}
             */
        this.updateUsersButton = actionBar.querySelector( "button.__action_refresh" )
        this.updateUsersButton.addEventListener( "click", () => this.getUsers() );
        this.selectedUserElement = null;

        window.addEventListener( "click", (evt) => this.getContextFromClick( evt ) );

    }

        /**
         * @param {MouseEvent} evt 
         */
    getContextFromClick( evt ) {

            /**
             * @type {HTMLElement?}
             */
        const targetElement = evt.target;
        const targetElementTag = targetElement.tagName.toLowerCase();

        switch( targetElementTag ) {

            case "td":
                this.handleEntryClick( evt );
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

            const entryID = Number.parseInt( dataElement.dataset.entryid );

            if( this.userManagerAjaxController.users.has( entryID ) ) {

                if( this.selectedUserElement != null ) {
                    this.selectedUserElement.classList.remove( "selected" );
                }

                const selectedUser = this.userManagerAjaxController.users.get( entryID );
                this.userManagerAjaxController.selectedUser = selectedUser;
                
                this.selectedUserElement = dataElement;
                this.selectedUserElement.classList.add( "selected" );

            }

        }

    }

    async getUsers() {

        await this.userManagerAjaxController.getUsers();
        this.displayManager.updateView( this.userManagerAjaxController.users );

    }

}
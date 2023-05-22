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
             * @type {HTMLSpanElement}
             */
        this.managementCard_usernameEntry = managementCard.querySelector( "span.__userdata_username_entry" );

            /**
             * @type {HTMLSpanElement}
             */
        this.managementCard_createdOn = managementCard.querySelector( "span.__userdata_created_timestamp" );

            /**
             * @type {HTMLSpanElement}
             */
        this.managementCard_spaceUsed = managementCard.querySelector( "span.__userdata_space_used" );

            /**
             * @type {HTMLSpanElement}
             */
        this.managementCard_spaceLimit = managementCard.querySelector( "span.__userdata_space_limit" );

            /**
             * @type {HTMLButtonElement}
             */
        this.updateUsersButton = actionBar.querySelector( "button.__action_refresh" )
        this.updateUsersButton.addEventListener( "click", () => this.getUsers() );

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

                const selectedUser = this.userManagerAjaxController.users.get( entryID );

                this.userManagerAjaxController.selectedUser = selectedUser;
                this.updateManagementCard();

            }

        }

    }
 
    updateManagementCard() {

        const selectedUser = this.userManagerAjaxController.selectedUser;

        this.managementCard_usernameEntry.innerText = selectedUser.username;
        this.managementCard_createdOn.innerText = selectedUser.timestampCreated.toISOString();

    }

    async getUsers() {

        await this.userManagerAjaxController.getUsers();
        this.displayManager.updateView( this.userManagerAjaxController.users );

    }

}
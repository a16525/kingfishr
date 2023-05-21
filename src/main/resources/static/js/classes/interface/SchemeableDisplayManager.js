import { Entry } from "../types/entry/Entry.js";
import { DisplayManager } from "./DisplayManager.js";

    /**
     * A more flexible display manager that can toggle between schemes.
     */
export class SchemeableDisplayManager extends DisplayManager {

    static schemes = {
        LIST: "list",
        GRID: "grid"
    };

        /**
         * @param {String} scheme 
         * @param {HTMLDivElement} viewParent 
         * @param {HTMLButtonElement} togglerButton
         */
    constructor( scheme, viewParent, togglerButton ) {
        
        super( viewParent );

        this.scheme = scheme;
        
        this.targetElements = {
                /**
                 * @type {HTMLDivElement}
                 */
            LIST: this.viewParent.querySelector( "div.__display_manager_scheme_list" ),
                /**
                 * @type {HTMLDivElement}
                 */
            GRID: this.viewParent.querySelector( "div.__display_manager_scheme_grid" )
        };

        switch( this.scheme ) {

            case SchemeableDisplayManager.schemes.LIST: default:
                this.currentTargetElement = this.targetElements.LIST;
            break;

            case SchemeableDisplayManager.schemes.GRID:
                this.currentTargetElement = this.targetElements.GRID;
            break;

        }

        this.togglerButton = togglerButton;
        this.togglerButton.addEventListener( "click", () => this.toggleScheme() );

    }

        /**
         * @override
         * @param {Map<any, Entry>} data 
         */
    updateView( data ) {

        switch( this.scheme ) {

            case SchemeableDisplayManager.schemes.LIST:

                const tableContent = this.currentTargetElement.querySelector( "tbody.__display_manager_scheme_list_content" );
                tableContent.innerHTML = "";

                data.forEach( ( entry, key ) => {

                    const entryRow = document.createElement( "tr" );
                    
                    entryRow.classList.add( "data_entry" );
                    entryRow.dataset.entryid = key;

                    const entryData = entry.dataArray();

                    for( let i = 0; i < entryData.length + 1; i++ ) {

                        const currentCell = entryRow.insertCell( i );

                        if( i == 0 ) {
                            currentCell.appendChild( entry.iconElement() );
                        } else {
                            currentCell.innerText = entryData[ i - 1 ];
                        }

                    }

                    tableContent.appendChild( entryRow );

                });

                this.updateTableHeight();

            break;

            case SchemeableDisplayManager.schemes.GRID:
                // TBI
            break;

        }

    }

        /**
         * @override
         */
    updateTableHeight() {

        if( this.scheme != SchemeableDisplayManager.schemes.LIST ) return;
        super.updateTableHeight();

    }

    toggleDisplayScheme() {

            /**
             * @type {HTMLElement}
             */
        const listIcon = this.togglerButton.querySelector( "i.bi.__displayicon_scheme_list" );

            /**
             * @type {HTMLElement}
             */
        const gridIcon = this.togglerButton.querySelector( "i.bi.__displayicon_scheme_grid" );

        switch( this.scheme ) {

            case SchemeableDisplayManager.schemes.LIST:

                this.scheme = DisplayManager.schemes.GRID;
                this.currentTargetElement = this.targetElements.GRID;

                listIcon.classList.add( "d-none" );
                gridIcon.classList.remove( "d-none" );

            break;

            case SchemeableDisplayManager.schemes.GRID:

                this.scheme = DisplayManager.schemes.LIST;
                this.currentTargetElement = this.targetElements.LIST;

                listIcon.classList.remove( "d-none" );
                gridIcon.classList.add( "d-none" );

            break;

        }

    }

}
import { Entry } from "../types/entry/Entry.js";
import { FileDataEntry } from "../types/entry/FileDataEntry.js";
import { FileTypeTranslator } from "../types/entry/FileTypeTranslator.js";
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
        this.togglerButton.addEventListener( "click", () => this.toggleDisplayScheme() );

            /**
             * @type {Map<any, Entry>?}
             */
        this.oldData = undefined;

            /**
             * @type {HTMLDivElement}
             */
        this.cardTemplate = document.querySelector( "div.__display_manager_scheme_grid_data_entry_template" );

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

                    for( let i = 0; i < entryData.length + 2; i++ ) {

                        const currentCell = entryRow.insertCell( i );

                        if( i == 0 ) {
                            currentCell.appendChild( entry.iconElement() );
                        } else
                        if( i == entryData.length + 1 ) {

                            currentCell.classList.add( "dropdown" );

                            const propertiesButton = document.createElement( "button" );
                            propertiesButton.classList.add( "btn", "rounded-circle", "__rounded_button", "__entry_properties" );

                            const propertiesButtonIcon = document.createElement( "i" );
                            propertiesButtonIcon.classList.add( "bi", "bi-three-dots-vertical" );

                            propertiesButton.appendChild( propertiesButtonIcon );
                            
                            currentCell.appendChild( propertiesButton );
                            
                        } else {
                            currentCell.innerText = entryData[ i - 1 ];
                        }

                    }

                    tableContent.appendChild( entryRow );

                });

                this.updateHeight();

            break;

            case SchemeableDisplayManager.schemes.GRID:
                
                const gridContent = this.currentTargetElement;
                gridContent.innerHTML = "";

                data.forEach( ( entry, key ) => {

                            /**
                         * @type {HTMLDivElement}
                         */
                    const dataEntryCard = this.cardTemplate.cloneNode( true );

                        /**
                         * @type {HTMLSpanElement}
                         */
                    const nameEntry = dataEntryCard.querySelector( "span.__data_entry_card_name" );

                        /**
                         * @type {HTMLElement}
                         */
                    const bigIcon = dataEntryCard.querySelector( "i.__data_entry_card_big_icon" );

                        /**
                         * @type {HTMLElement}
                         */
                    const smallIcon = dataEntryCard.querySelector( "i.__data_entry_card_small_icon" );

                        /**
                         * @type {HTMLButtonElement}
                         */
                    const clickCaptor = dataEntryCard.querySelector( "button.__card_click_captor" );
                    clickCaptor.dataset.entryid = key;

                    nameEntry.innerText = entry.name;

                        /**
                         * @type {FileTypeTranslator}
                         */
                    const translator = FileDataEntry.typeTranslationMap.get( entry.type );
                    const iconName = "bi-" + translator.fileIcon;

                    bigIcon.classList.add( iconName );
                    smallIcon.classList.add( iconName );

                    dataEntryCard.classList.remove( "d-none" );

                    gridContent.appendChild( dataEntryCard );

                });

                this.updateHeight();

            break;

        }

        this.oldData = data;

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

                this.scheme = SchemeableDisplayManager.schemes.GRID;
                this.currentTargetElement = this.targetElements.GRID;

                this.targetElements.LIST.classList.add( "d-none" )
                this.targetElements.GRID.classList.remove( "d-none" );

                listIcon.classList.add( "d-none" );
                gridIcon.classList.remove( "d-none" );

            break;

            case SchemeableDisplayManager.schemes.GRID:

                this.scheme = SchemeableDisplayManager.schemes.LIST;
                this.currentTargetElement = this.targetElements.LIST;

                this.targetElements.LIST.classList.remove( "d-none" )
                this.targetElements.GRID.classList.add( "d-none" );

                listIcon.classList.remove( "d-none" );
                gridIcon.classList.add( "d-none" );

            break;

        }

        this.updateView( this.oldData );

    }

}
import { DataEntry } from "../types/DataEntry.js";

export class DisplayManager {

    static schemes = {

        LIST: "list",
        CARD: "card"
        
    }

        /**
         * @param {string} scheme 
         * @param {HTMLDivElement} viewParent 
         * @param {HTMLButtonElement} toggler 
         */
    constructor( scheme, viewParent, toggler ) {

        this.scheme = scheme;
        this.viewParent = viewParent;

        this.targetElements = {
            LIST: this.viewParent.getElementsByClassName( "__fileview_list" )[0],
            CARD: this.viewParent.getElementsByClassName( "__fileview_card" )[0]
        };

        switch( this.scheme ) {

            case DisplayManager.schemes.LIST: default:
                this.currentTargetElement = this.targetElements.LIST;
            break;

            case DisplayManager.schemes.CARD:
                this.currentTargetElement = this.targetElements.CARD;
            break;

        }

        this.toggler = toggler;
        this.toggler.addEventListener( 'click', () => this.toggleScheme() );

    }

        /**
         * Updates the current view based on the data provided.
         * @param {Map<string, DataEntry>} data 
         */
    updateView( data ) {

        switch( this.scheme ) {

            case DisplayManager.schemes.LIST:

                const tableContent = this.currentTargetElement.getElementsByClassName( "__fileview_table_content" )[0];
                tableContent.innerHTML = "";

                data.forEach( ( entry, key ) => {

                    const entryRow = document.createElement( "tr" );

                    entryRow.classList.add( "data_entry" );
                    entryRow.dataset.entryid = key;

                    const entryData = entry.dataArray();

                    for( let i = 0; i < entryData.length + 1; i++ ) {

                        const currentCell = entryRow.insertCell(i);

                        if( i == 0 ) {
                            currentCell.appendChild( entry.iconElement() );
                        } else {
                            currentCell.innerText = entryData[i - 1];
                        }

                    }

                    tableContent.appendChild( entryRow );

                });

                this.updateTableHeight();

            break;

        }

    }

        /**
         * Updates the table's height. Returns if the display scheme is not LIST.
         */
    updateTableHeight() {

        if( this.scheme != DisplayManager.schemes.LIST ) return;

        const parent = document.getElementById( "views" );
        const childrenElements = document.getElementsByClassName( "__views_storage_container" )[0].children;
        const childrenArray = Array.from( childrenElements );

        const target = document.getElementsByClassName( "__fileview_list" )[0];

        let height = parent.offsetHeight;
        childrenArray.forEach( child => {
            if( child != target ) height -= child.offsetHeight;
        });

        target.style.height = height + "px";

    }

        /**
         * Toggles between available display schemes.
         */
    toggleDisplayScheme() {

        const listIcon = this.toggler.getElementsByClassName( "__displayicon_list" )[0];
        const cardIcon = this.toggler.getElementsByClassName( "__displayicon_card" )[0];

        switch( this.scheme ) {

            case DisplayManager.schemes.LIST:

                this.scheme = DisplayManager.schemes.CARD;
                this.currentTargetElement = this.targetElements.CARD;

                listIcon.classList.add( "d-none" );
                cardIcon.classList.remove( "d-none" );

            break;

            case DisplayManager.schemes.CARD: default:

                this.scheme = DisplayManager.schemes.LIST;
                this.currentTargetElement = this.targetElements.LISt;

                listIcon.classList.remove( "d-none" );
                cardIcon.classList.add( "d-none" );

            break;

        }

    }

}
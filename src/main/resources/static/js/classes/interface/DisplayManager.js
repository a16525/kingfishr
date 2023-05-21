import { Entry } from "../types/entry/Entry.js";

export class DisplayManager {

        /**
         * @param {HTMLDivElement} viewParent
         */
    constructor( viewParent ) {

        this.viewParent = viewParent;

        let _ = viewParent.querySelector( "div.__display_manager_default_target_element" );

            /**
             * @type {HTMLDivElement}
             */
        this.currentTargetElement = _ != null ?
            _ : this.viewParent.querySelector( "div.__display_manager_scheme_list" );

    }

        /**
         * @param {Map<any, Entry>} data 
         */
    updateView( data ) {

            /**
             * @type {HTMLTableSectionElement}
             */
        const tableContent = this.viewParent.querySelector( "div.__display_manager_scheme_list_content" );
        tableContent.innerHTML = "";

        data.forEach( ( entry, key ) => {

            const entryRow = document.createElement( "tr" );

            entryRow.classList.add( "data_entry" );
            entryRow.dataset.entryid = key;

            const entryData = entry.dataArray();

            for( let i = 0; i < entryData.length; i++ ) {

                const currentCell = entryRow.insertCell( i );
                currentCell.innerText = entryData[ i ];

            }

            tableContent.appendChild( entryRow );

        });

        this.updateTableHeight();

    }

    updateTableHeight() {

            /**
             * @type {HTMLDivElement}
             */
        const target = this.viewParent.querySelector( "div.__display_manager_scheme_list" );
        const parent = target.parentElement;

        const children = Array.from( parent.children );

        let height = parent.offsetHeight;
        
        children.forEach( child => {
            if( child != target ) height -= child.offsetHeight;
        });

        target.style.maxHeight = height + "px";
        
    }

}
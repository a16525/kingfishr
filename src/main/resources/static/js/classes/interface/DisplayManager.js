import { Entry } from "../types/entry/Entry.js";

    /**
     * Display manager that only works with tables.
     */
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
            _:
            viewParent.querySelector( "div.__display_manager_theme_list" );

    }

        /**
         * @param {Map<any, Entry>} data 
         */
    updateView( data ) {
        
            /**
             * @type {HTMLTableSectionElement}
             */
        const tableContent = this.viewParent.querySelector( "div.__display_manager_theme_list_content" );
        tableContent.innerHTML = "";

        data.forEach( ( entry, key ) => {

            const entryRow = document.createElement( "tr" );

            entryRow.classList.add( "data_entry" );
            entryRow.dataset.entryid = key;

            const entryData = entry.dataArray();

            for( let i = 0; i < entryData.length; i++ ) {

                const currentCell = entryRow.insertCell( i );
                currentCell.innerText = entryData[i];

            }

            tableContent.appendChild( entryRow );

        });

        this.updateTableHeight();

    }

    updateTableHeight() {
        
        const parent = this.viewParent.parentElement;
        
        const childrenElements = Array.from( parent.children );

            /**
             * @type {HTMLDivElement}
             */
        const target = viewParent.querySelector( "div.__display_manager_theme_list" );

        let height = parent.offsetHeight;

        childrenElements.forEach( child => {
            if( child != target ) height -= child.offsetHeight;
        });

        target.style.height = height + "px";
        
    }

}
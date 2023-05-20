    /**
     * @type {Map<String, HTMLElement[]>}
     */
const navigationTabs = new Map();

    /**
     * @param {MouseEvent} evt 
     */
function synchronizeNavbars( evt ) {

        /**
         * @type {HTMLElement?}
         */
    let targetElement = evt.target;

    let targetElementTargetID = targetElement.attributes.getNamedItem( "aria-controls" ).value;

    navigationTabs.forEach( ( elements, target ) => {

        if( targetElementTargetID == target ) {
            elements.forEach( element => element.classList.add( 'active' ) );
        } else {
            elements.forEach( element => element.classList.remove( 'active' ) );
        }

    });

}

document.addEventListener( "DOMContentLoaded", () => {

    const navbarElements = Array.from( document.getElementsByClassName( "nav-link" ) );

    navbarElements.forEach( element => {

        let targetElement = element.attributes.getNamedItem( "aria-controls" ).value;

        if( navigationTabs.has( targetElement ) ) {
            navigationTabs.get( targetElement ).push( element );
        } else {
            navigationTabs.set( targetElement, [ element ] );
        }

        element.addEventListener( "click", synchronizeNavbars )

    });

});
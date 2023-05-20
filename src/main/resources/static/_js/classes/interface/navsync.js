const navtabs = new Map();

    /**
     * Synchronises both navbars.
     * @param {MouseEvent} evt 
     */
function syncNavbars( evt ) {

    let targetElement = evt.target;
    let targetElementNavbarTarget = targetElement.attributes.getNamedItem( "aria-controls" ).value;

    navtabs.forEach( ( elements, target ) => {

        if( targetElementNavbarTarget == target ) {
            elements.forEach( element => element.classList.add( 'active' ) );
        } else {
            elements.forEach( element => element.classList.remove( 'active' ) );
        }

    });

}

document.addEventListener( 'DOMContentLoaded', () => {

    const navbarElements = Array.from( document.getElementsByClassName( "nav-link" ) );

    navbarElements.forEach( element => {

        let targetElement = element.attributes.getNamedItem( "aria-controls" ).value;

        if( navtabs.has( targetElement ) ) {
            navtabs.get( targetElement ).push( element );
        } else {
            navtabs.set( targetElement, [ element ] );
        }

        element.addEventListener( 'click', syncNavbars );

    });

});
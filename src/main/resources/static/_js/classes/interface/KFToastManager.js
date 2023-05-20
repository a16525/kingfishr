import { KFToast } from "../types/KFToast.js";

export class KFToastManager {

        /**
         * 
         * @param {HTMLDivElement} toastContainer 
         */
    constructor( toastContainer ) {

        this.trackedToasts = new Map();
        this.toastContainer = toastContainer;

    }

        /**
         * @param {KFToast} toast 
         */
    trackToast( toast ) {

        const toastID = this.randomToastID();

        toast.addEventListener( "dispose", () => {
            this.disposeToast( toastID );
        });

        this.trackedToasts.set( toastID, toast );
        this.toastContainer.appendChild( toast.elementToast );

        return toastID;

    }

    randomToastID() {
        return Math.random().toString( 36 ).slice( 2, 10 );
    }
    
    showToast( toastID ) {

        const toast = this.trackedToasts.get( toastID );
        toast.show();

    }

    hideToast( toastID ) {

        const toast = this.trackedToasts.get( toastID );
        toast.hide();

    }

    disposeToast( toastID ) {

        const toast = this.trackedToasts.get( toastID );
        setTimeout( () => toast.hide(), 3000 );

        toast.addEventListener( "hidden.bs.toast", () => {

            this.trackedToasts.delete( toastID );
            toast.remove();

        });

    }

}
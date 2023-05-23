import { KFToast } from "../types/interface/toasts/KFToast.js";

export class KFToastManager {

    /**
     * @param {HTMLDivElement} toastContainer
     */
    constructor( toastContainer ) {

        this.toastContainer = toastContainer;

            /**
             * @type {Map<String, KFToast>}
             */
        this.trackedToasts = new Map();

    }

        /**
         * @param {Number} length 
         * @returns {String}
         */
    randomToastID( length = 8 ) {
        return Math.random().toString( 36 ).slice( 2, 2 + length );
    }

        /**
         * @param {KFToast} toast
         */
    trackToast( toast ) {

        const toastID = this.randomToastID();

        this.trackedToasts.set( toastID, toast );
        this.toastContainer.appendChild( toast.toastElement );

        toast.addEventListener( "toast-dispose", () => {
            this.disposeToast( toastID );
        });

        return toastID;

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

        toast.toastElement.addEventListener( "hidden.bs.toast", () => {

            this.trackedToasts.delete( toastID );
            toast.remove();

        });

    }

}
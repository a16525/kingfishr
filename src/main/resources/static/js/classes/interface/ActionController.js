import { DisplayManager } from "./DisplayManager.js";

export class ActionController extends EventTarget {

        /**
         * @param {DisplayManager} displayManager
         */
    constructor( displayManager ) {

        super();
        
        this.displayManager = displayManager;

    }

}
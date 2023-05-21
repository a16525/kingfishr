import { Endpoint } from "../types/networking/Endpoint.js";

export class AJAXController extends EventTarget {

        /**
         * @abstract
         * @type {Enumerator<Endpoint>}
         */
    static endpoints;

    constructor() {
        super();
    }

}
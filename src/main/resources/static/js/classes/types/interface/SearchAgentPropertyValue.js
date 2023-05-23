import { Entry } from "../entry/Entry.js";

export class SearchAgentPropertyValue {

        /**
         * @param {any} value 
         * @param {Entry} owner 
         */
    constructor( value, owner ) {

        this.value = value;
        this.owner = owner;

    }

}
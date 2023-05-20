import { Entry } from "./Entry.js";

export class UserEntry extends Entry {

    /**
     * @typedef {Object} UserEntryLike
     * @property {Number} id
     * @property {String} username
     * @property {Boolean} isConfigurator
     */

        /**
         * @override
         * @param {UserEntryLike} JSON 
         * @returns {UserEntry}
         */
    static fromJSON( JSON ) {

        const { id, username, isConfigurator } = JSON;

        if( id != undefined && username != undefined && isConfigurator != undefined ) {
            return new UserEntry( id, username );
        } else {
            throw new Error( "Invalid JSON data passed to UserEntry constructor." );
        }

    }

        /**
         * @override
         * @param {Number} id 
         * @param {String} username 
         * @param {Boolean} isConfigurator
         */
    constructor( id, username, isConfigurator ) {

        this.id = id;
        this.username = username;
        this.isConfigurator = isConfigurator;

    }

        /**
         * @override
         */
    dataArray() {

        return [
            this.id,
            this.username,
            this.isConfigurator
        ];

    }

}
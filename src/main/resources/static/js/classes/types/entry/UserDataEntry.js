import { Entry } from "./Entry.js";

export class UserDataEntry extends Entry {

    /**
     * @typedef {Object} UserDataEntryLike
     * @property {Number} id
     * @property {String} username
     * @property {Number} storageused
     * @property {Number} timestampCreated
     * @property {Boolean} configurator
     */

        /**
         * @override
         * @param {UserDataEntryLike} JSON 
         * @returns {UserEntry}
         */
    static fromJSON( JSON ) {        

        const { id, username, storageUsed, timestampCreated, configurator } = JSON;

        if( id != undefined && username != undefined && storageUsed != undefined && timestampCreated != null && configurator != undefined ) {
            return new UserDataEntry( id, username, storageUsed, timestampCreated, configurator );
        } else {
            throw new Error( "Invalid JSON data passed to UserEntry constructor." );
        }

    }

        /**
         * @override
         * @param {Number} id 
         * @param {String} username 
         * @param {Number} storageUsed
         * @param {Date} timestampCreated
         * @param {Boolean} isConfigurator
         */
    constructor( id, username, storageUsed, timestampCreated, isConfigurator ) {

        super();

        this.id = id;
        this.username = username;
        this.storageUsed = storageUsed;
        this.timestampCreated =  new Date( timestampCreated );
        this.isConfigurator = isConfigurator;

    }

        /**
         * @override
         */
    dataArray() {

        return [
            this.id,
            this.username,
            this.storageUsed,
            this.isConfigurator ? "Yes" : "No"
        ];

    }

}
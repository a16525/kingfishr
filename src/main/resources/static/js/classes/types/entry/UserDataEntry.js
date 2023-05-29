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

    humanReadableStorageOccupied() {

        const units = [
            "Bytes",
            "Kilobytes",
            "Megabytes",
            "Gigabytes",
            "Terabytes",
            "Petabytes",
            "Exabytes",
            "Zettabytes",
            "Brontobytes",
            "Geopbytes"
        ];

        let sizeInBytes = this.storageUsed;
        let scale = 0;

        while( sizeInBytes >= 1000 && ++scale ) {
            sizeInBytes /= 1000;
        }

        return sizeInBytes.toFixed( scale > 0 ? 1 : 0 ) + " " + units[scale];

    }

        /**
         * @override
         */
    dataArray() {

        return [
            this.id,
            this.username,
            this.isConfigurator || this.storageUsed == 0 ? "None" : this.humanReadableStorageOccupied(),
            this.timestampCreated.toISOString()
        ];

    }

}
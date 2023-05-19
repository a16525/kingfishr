export class UserEntry {

        /**
         * @typedef {Object} UserEntryLike
         * @property {Number} id
         * @property {String} username
         */

        /**
         * @override
         * Takes a JSON object and returns a UserEntry instance from it.
         * Must have 'id', and 'username' defined.
         * @param {UserEntryLike} JSON 
         * @returns {UserEntry}
         */
    static fromJSON( JSON ) {

        const { id, username } = JSON;

        if( id != undefined && username != undefined ) {
            return new UserEntry( id, username );
        } else {
            throw new Error( "Invalid JSON data passed to UserEntry constructor." );
        }

    }

        /**
         * @override
         * @param {Number} id 
         * @param {String} username 
         */
    constructor( id, username ) {

        this.id = id;
        this.username = username;

    }

}
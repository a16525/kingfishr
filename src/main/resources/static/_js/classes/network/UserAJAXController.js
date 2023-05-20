import { Endpoint } from "../types/Endpoint.js";
import { UserEntry } from "../types/UserEntry.js"
import { AJAXController } from "./AJAXController.js";

export class UserAJAXController extends AJAXController {

    static endpoints = {
        
        GETUSER: new Endpoint( "/api/user", Endpoint.HTTPMethods.GET ),
        GETALLUSERS: new Endpoint( "/api/users", Endpoint.HTTPMethods.GET ),
        CREATEUSER: new Endpoint( "/api/user", Endpoint.HTTPMethods.POST ),
        RENAMEUSER: new Endpoint( "/api/user", Endpoint.HTTPMethods.PATCH ),
        DELETEUSER: new Endpoint( "/api/user", Endpoint.HTTPMethods.DELETE )

    }

    constructor() {

        super();

            /**
             * @type {Map<String, UserEntry>}
             */
        this.users = new Map();

            /**
             * @type {UserEntry?}
             */
        this.selectedUser = null;

    }

        /**
         * @returns {Map<Number, UserEntry}
         */
    async getUsers() {

        const userMap = new Map();

        const endpoint = UserAJAXController.endpoints.GETALLUSERS;
        const request = endpoint.path;

        await fetch( request, { method: endpoint.method } ).then( async response => {

            if( response.ok ) {

                const JSONData = await response.json();
                const users = Array.from( JSONData ).map( value => UserEntry.fromJSON( value ) );

                users.forEach( user => userMap.set( user.id, user ) );

            } else {
                throw new Error( await response.text() );
            }

        });

        this.users = userMap;

    }

        /**
         * @param {Number} id
         * @returns {UserEntry}
         */
    async getUser( id ) {

        let user = null;

        const endpoint = UserAJAXController.endpoints.GETUSER;
        const request = endpoint.appendParams( new URLSearchParams({
            id: id
        }));

        await fetch( request, { method: endpoint.method }).then( async response => {

            if( response.ok ) {

                const JSONData = await response.json();
                user = UserEntry.fromJSON( JSONData );

            } else {
                throw new Error( await response.text() );
            }

        });

        return user;

    }

        /**
         * @overload
         * @param {String} username
         * @returns {UserEntry}
         */
    async getUser( username ) {

        let user = null;

        const endpoint = UserAJAXController.endpoints.GETUSER;
        const request = endpoint.appendParams( new URLSearchParams({
            name: username
        }));

        await fetch( request, { method: endpoint.method }).then( async response => {

            if( response.ok ) {

                const JSONData = await response.json();
                user = UserEntry.fromJSON( JSONData );

            } else {
                throw new Error( await response.text() );
            }

        });

        return user;

    }

        /**
         * @param {FormData} formData
         */
    async createUser( formData ) {

        const username = formData.get( "username" );
        const password = formData.get( "password" );

        if( username == null || username.length == 0 ) {
            throw new Error( "Username cannot be empty." );
        } else
        if( password == null || password.length == 0 ) {
            throw new Error( "Password cannot be empty." );
        } else {

            const endpoint = UserAJAXController.endpoints.CREATEUSER;
            const request = endpoint.appendParams( {
                name: username,
                password: password
            });

            await fetch( request, { method: endpoint.method }).then( async response => {

                if( !response.ok ) {
                    throw new Error( await response.text() );
                }

            });

        }

    }


        /**
         * @param {Number} id 
         * @param {String} newName 
         */
    async renameUser( id, newName ) {

        const endpoint = UserAJAXController.endpoints.RENAMEUSER;
        const request = endpoint.appendParams( new URLSearchParams({
            id: id,
            newname: newName
        }));

        await fetch( request, { method: endpoint.method }).then( async response => {

            if( !response.ok ) {
                throw new Error( await response.text() );
            }

        });

    }

        /**
         * @overload
         * @param {String} oldName
         * @param {String} newName 
         */
    async renameUser( oldName, newName ) {

        const endpoint = UserAJAXController.endpoints.RENAMEUSER;
        const request = endpoint.appendParams( new URLSearchParams({
            name: oldName,
            newname: newName
        }));

        await fetch( request, { method: endpoint.method }).then( async response => {

            if( !response.ok ) {
                throw new Error( await response.text() );
            }

        });

    }

        /**
         * @param {Number} id 
         */
    async deleteUser( id ) {

        const endpoint = UserAJAXController.endpoints.DELETEUSER;
        const request = endpoint.appendParams( new URLSearchParams({
            id: id
        }));

        await fetch( request, { method: endpoint.method }).then( async response => {

            if( !response.ok ) {
                throw new Error( await response.text() );
            }

        });

    }
    
        /**
         * @overload
         * @param {String} name
         */
    async deleteUser( name ) {
    
        const endpoint = UserAJAXController.endpoints.DELETEUSER;
        const request = endpoint.appendParams( new URLSearchParams({
            name: name
        }));
    
        await fetch( request, { method: endpoint.method }).then( async response => {
    
            if( !response.ok ) {
                throw new Error( await response.text() );
            }
    
        });
    
    }

}
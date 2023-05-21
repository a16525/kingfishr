import { Endpoint } from "../types/networking/Endpoint.js";
import { UserDataEntry } from "../types/entry/UserDataEntry.js";
import { AJAXController } from "../networking/AJAXController.js";

export class UserManagerAJAXController extends AJAXController {

    static endpoints = {
        
        GETUSER: new Endpoint( "/api/user", Endpoint.httpMethods.GET ),
        GETALLUSERS: new Endpoint( "/api/users", Endpoint.httpMethods.GET ),
        CREATEUSER: new Endpoint( "/api/user", Endpoint.httpMethods.POST ),
        RENAMEUSER: new Endpoint( "/api/user", Endpoint.httpMethods.PATCH ),
        DELETEUSER: new Endpoint( "/api/user", Endpoint.httpMethods.DELETE )

    }

    constructor() {

        super();

            /**
             * @type {Map<Number, UserDataEntry>}
             */
        this.users = new Map();

            /**
             * @type {UserDataEntry?}
             */
        this.selectedUser = null;

    }

        /**
         * @returns {Map<Number, UserDataEntry}
         */
    async getUsers() {

        const userMap = new Map();

        const endpoint = UserManagerAJAXController.endpoints.GETALLUSERS;
        const request = endpoint.path;

        await fetch( request, { method: endpoint.method } ).then( async response => {

            if( response.ok ) {

                const JSONData = await response.json();
                const users = Array.from( JSONData ).map( value => UserDataEntry.fromJSON( value ) );

                users.forEach( user => userMap.set( user.id, user ) );

            } else {
                throw new Error( await response.text() );
            }

        });

        this.users = userMap;

    }

        /**
         * @param {Number} id
         * @returns {UserDataEntry}
         */
    async getUser( id ) {

        let user = null;

        const endpoint = UserManagerAJAXController.endpoints.GETUSER;
        const request = endpoint.appendParameters( new URLSearchParams({
            id: id
        }));

        await fetch( request, { method: endpoint.method }).then( async response => {

            if( response.ok ) {

                const JSONData = await response.json();
                user = UserDataEntry.fromJSON( JSONData );

            } else {
                throw new Error( await response.text() );
            }

        });

        return user;

    }

        /**
         * @overload
         * @param {String} username
         * @returns {UserDataEntry}
         */
    async getUser( username ) {

        let user = null;

        const endpoint = UserManagerAJAXController.endpoints.GETUSER;
        const request = endpoint.appendParameters( new URLSearchParams({
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

            const endpoint = UserManagerAJAXController.endpoints.CREATEUSER;
            const request = endpoint.appendParameters( new URLSearchParams({
                name: username,
                password: password
            }));

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

        const endpoint = UserManagerAJAXController.endpoints.RENAMEUSER;
        const request = endpoint.appendParameters( new URLSearchParams({
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

        const endpoint = UserManagerAJAXController.endpoints.RENAMEUSER;
        const request = endpoint.appendParameters( new URLSearchParams({
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

        const endpoint = UserManagerAJAXController.endpoints.DELETEUSER;
        const request = endpoint.appendParameters( new URLSearchParams({
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
    
        const endpoint = UserManagerAJAXController.endpoints.DELETEUSER;
        const request = endpoint.appendParameters( new URLSearchParams({
            name: name
        }));
    
        await fetch( request, { method: endpoint.method }).then( async response => {
    
            if( !response.ok ) {
                throw new Error( await response.text() );
            }
    
        });
    
    }

}
import { Endpoint } from "../types/networking/Endpoint.js";
import { UserDataEntry } from "../types/entry/UserDataEntry.js";
import { AJAXController } from "../networking/AJAXController.js";

export class UserManagerAJAXController extends AJAXController {

    static endpoints = {
        
        GETUSER: new Endpoint( "/api/user", Endpoint.httpMethods.GET ),
        GETALLUSERS: new Endpoint( "/api/users", Endpoint.httpMethods.GET ),
        CREATEUSER: new Endpoint( "/api/user", Endpoint.httpMethods.POST ),
        RENAMEUSER: new Endpoint( "/api/user", Endpoint.httpMethods.PATCH ),
        CHANGEUSERPASSWORD: new Endpoint( "/api/user/password", Endpoint.httpMethods.PATCH ),
        DELETEUSER: new Endpoint( "/api/user", Endpoint.httpMethods.DELETE )

    }

    static illegalUsernameCharacters = "[#%&{}\\<>*?/$!'\":@+`|=]+?";

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
        if( username.match( UserManagerAJAXController.illegalUsernameCharacters ) != null ) {
            throw new Error( "Invalid username." );
        } else
        if( password == null || password.length <= 3 ) {
            throw new Error( "Password must not be empty/must have atleast four characters." );
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
         * @param {UserDataEntry} user
         * @param {FormData} formData   
         */
    async renameUser( user, formData ) {

        const newName = formData.get( "username" );

        if( user == null ) {
            throw new Error( "User must be selected." );
        } else
        if( newName == null || newName.length == 0 ) {
            throw new Error( "New username cannot be empty." )
        } else
        if( newName.match( UserManagerAJAXController.illegalUsernameCharacters ) != null ) {
            throw new Error( "Invalid username." );
        } else {

            const endpoint = UserManagerAJAXController.endpoints.RENAMEUSER;
            const request = endpoint.appendParameters( new URLSearchParams({
                id: user.id,
                newname: newName
            }));

            await fetch( request, { method: endpoint.method }).then( async response => {

                if( !response.ok ) {
                    throw new Error( await response.text() );
                }

            });

        }

    }

        /**
         * @param {UserDataEntry} user 
         * @param {FormData} formData 
         */
    async changeUserPassword( user, formData ) {

        const oldPassword = formData.get( "old-password" );
        const newPassword = formData.get( "new-password" );

        if( user == null ) {
            throw new Error( "User must be selected." );
        } else
        if( oldPassword == null || oldPassword.length == 0 ) {
            throw new Error( "Old password cannot be empty." );
        } else
        if( newPassword == null || newPassword.length <= 3 ) {
            throw new Error( "New password must not be empty/must have atleast four characters." );
        } else {

            const endpoint = UserManagerAJAXController.endpoints.CHANGEUSERPASSWORD;
            const request = endpoint.appendParameters( new URLSearchParams({
                id: user.id,
                oldpassword: oldPassword,
                newpassword: newPassword
            }));

            await fetch( request, { method: endpoint.method }).then( async response => {

                if( !response.ok ) {
                    throw new Error( await response.text() );
                }

                if( user.isConfigurator ) {
                    location.reload();
                }

            });

        }

    }

        /**
         * @param {UserDataEntry} user 
         */
    async deleteUser( user ) {

        if( user == null ) {
            throw new Error( "User must be selected." );
        } else {

            const endpoint = UserManagerAJAXController.endpoints.DELETEUSER;
            const request = endpoint.appendParameters( new URLSearchParams({
                id: user.id
            }));

            await fetch( request, { method: endpoint.method }).then( async response => {

                if( !response.ok ) {
                    throw new Error( await response.text() );
                }

            });

        }

    }

}
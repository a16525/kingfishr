export class Endpoint {

    static httpMethods = {

        GET: "GET",
        POST: "POST",
        PUT: "PUT",
        PATCH: "PATCH",
        DELETE: "DELETE"

    }

        /**
         * @param {String} path 
         * @param {String} method 
         */
    constructor( path, method ) {

        this.path = path;
        this.method = method;
        
    }

        /**
         * @param {URLSearchParams} params
         * @returns {String}
         */
    appendParameters( parameters ) {
        return this.path + "?" + parameters;
    }

    toString() {
        return this.path;
    }

}
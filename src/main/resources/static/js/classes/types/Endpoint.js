export class Endpoint {

    static HTTPMethods = {

        GET: "GET",
        POST: "POST",
        PUT: "PUT",
        PATCH: "PATCH",
        DELETE: "DELETE"

    }

    /**
     * @param {String} path Path to the endpoint. 
     * @param {String} method Method of the endpoint.
     */
    constructor( path, method ) {

        this.path = path;
        this.method = method;

    }

    /**
     * @param {URLSearchParams} params Search params to append.
     * @returns {String}
     */
    appendParams( params ) {
        return this.path + "?" + params;
    }

    toString() {
        return this.path;
    }

}
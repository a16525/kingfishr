import { Entry } from "../types/entry/Entry.js";
import { SearchAgentPropertyValue } from "../types/interface/SearchAgentPropertyValue.js";

export class SearchAgent {

    constructor() {

            /**
             * @type {Map<String, SearchAgentPropertyValue[]>}
             */
        this.dataSet = new Map();

    }

        /**
         * @param {Map<any, Entry>} trainerMap
         * @param {String} dataKey
         */
    train( trainerMap ) {

            /**
             * @type {Map<String, SearchAgentPropertyValue[]>}
             */
        const trainedMap = new Map();

        const trainerMapValues = Array.from( trainerMap.values() );
        trainerMapValues.forEach( entry => {

            const objectPropertyValuePairs = Object.entries( entry );
            
            objectPropertyValuePairs.forEach( pair => {

                const propertyName = pair[0];
                const propertyValue = pair[1];
                const propertyOwner = entry;

                const searchAgentPropertyValue = new SearchAgentPropertyValue( propertyValue, propertyOwner );

                if( trainedMap.has( propertyName ) ) {
                    trainedMap.get( propertyName ).push( searchAgentPropertyValue );
                } else {
                    trainedMap.set( propertyName, [ searchAgentPropertyValue ] );
                }

            });
            
        });

        this.dataSet = trainedMap;

    }

        /**
         * @param {String} propertyName
         * @param {String} dataKey
         * @param {any} searchParameter 
         * @returns {Map<any, Entry>?}
         */
    contains( propertyName, dataKey, searchParameter ) {
        
        let filtered = new Map();

        const entries = this.dataSet.get( propertyName );
        entries.forEach( property => {
            
                /**
                 * @type {String}
                 */
            const value = property.value;

            if( value.includes( searchParameter ) ) {
                filtered.set( property.owner[dataKey], property.owner );
            }

        });

        return filtered;

    }

}
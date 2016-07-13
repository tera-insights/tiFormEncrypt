/// <reference path="../typings/index.d.ts" />

// module tiForms {

export class Converters {

    /**
     * Function to convert strings to binary data
     * 
     * @static
     * @param {string} data
     * @returns {Uint8Array}
     */
    static stringToUint8Array(data: string): Uint8Array {
        return Uint8Array.from(Array.prototype.map.call(data, x => { return x.charCodeAt(0); }))
    }

    /**
     * Function to convert binary data to string 
     * 
     * @static
     * @param {Uint8Array} data
     * @returns {string}
     */
    static Uint8ArrayToString(data: Uint8Array): string {
        return Array.prototype.map.call(data, x => {
            return String.fromCharCode(x);
        }).join('');
    }

    /**
     * Function to convert base64 strings to Uint8Array
     * @data is the string to be converted
     * @returns The raw Uint8Array
     */
    static base64ToUint8Array(data: string): Uint8Array {
        var asStr = atob(data);
        return Converters.stringToUint8Array(asStr);        
    }

    /**
     * Function to convert Uint8Array (raw data) to base64
     * @data The Uint8Array to convert
     * @returns The base64 encoded @data as string
     */
    static Uint8ArrayToBase64(data: Uint8Array): string {        
        return btoa(Converters.Uint8ArrayToString(data));
    }


}
//}
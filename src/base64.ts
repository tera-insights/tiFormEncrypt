/// <reference path="../typings/index.d.ts" />

// module tiForms {

export class Converters {

    /**
     * Function to convert base64 strings to Uint8Array
     * @data is the string to be converted
     * @returns The raw Uint8Array
     */
    static base64toUint8Array(data: string): Uint8Array {
        var asStr = atob(data);
        return Uint8Array.from(Array.prototype.map.call(asStr, x => { return x.charCodeAt(0); }))
    }

    /**
     * Function to convert Uint8Array (raw data) to base64
     * @data The Uint8Array to convert
     * @returns The base64 encoded @data as string
     */
    static Uint8ArraytoBase64(data: Uint8Array): string {
        var binstr = Array.prototype.map.call(data, x => {
            return String.fromCharCode(x);
        }).join('');
        return btoa(binstr);
    }

}
//}
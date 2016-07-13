/// <reference path="../typings/index.d.ts" />
/// <reference path="./Converters.ts" />

import { Converters as conv } from "./Converters.ts";

// module tiForms {

export interface EncryptedData {
    pubKey: string; // The public EC P-256 key as a Base64
    payload: string; // The encrypted payload as AES-256 CBC with IV=0. Key is derived usin Diffie-Helman 
}


export class Encryptor {
    private formKey: CryptoKey;
    private keyPromise: any;

    /**
     * Method encrypts a given binary blob. 
     * @returns: Promise fulfilled when encryption is complete that returns the 
     *  data 
     */
    encryptBinary(data: Uint8Array) {
        // Create a private key
        return crypto.subtle.generateKey(
            { name: "ECDH", namedCurve: "P-256" } as Algorithm,
            false /* make key not extractable */,
            ["deriveKey"] /* Only need key derivation */)
            .then(function (privKey: CryptoKey) {
                return crypto.subtle.deriveKey(
                    {
                        name: "ECDH", namedCurve: "P-256",
                        "public": this.formKey
                    } as Algorithm,
                    privKey,
                    { name: 'AES-CBC', length: 256 } as Algorithm,
                    false, ["encrypt"])
                    .then(function (aesKey: CryptoKey) {
                        return crypto.subtle.encrypt(
                            { name: 'AES-CBC', iv: new Uint8Array(16) } as Algorithm,
                            aesKey, data
                        ).then((encrypted: Uint8Array) => {
                            return conv.Uint8ArrayToBase64(encrypted);
                        });
                    });
            })
    }

    /**
     * Method to encrypt strings 
     * 
     * @param {string} data
     * @returns Promise with base64 encrypted string
     */
    encryptString(data: string) {
        return this.encryptBinary(conv.stringToUint8Array(data));
    }

    /**
     * Version of encryptString with callbacks as arguments
     * @success is provided with an object of type arguments
     * @fail is provided the error
     */
    encryptStringCB(data: string, success: Function, fail: Function) {
        this.encryptString(data).then(success, fail);
    }

    /**
     * Import an externally represented key 
     * 
     * @param {string} pubKey in base64 of raw
     */
    importKey(pubKey: string) {
        var that = this;
        this.keyPromise = crypto.subtle.importKey(
            "raw", conv.base64ToUint8Array(pubKey),
            { name: "ECDH", namedCurve: "P-256" } as Algorithm,
            false, ['deriveKey']
        ).then((key) => {
            that.formKey = key;
        })
    }

    /**
     * Method that allows  correct chainging of decryption related activieties 
     * 
     * @param {Function} [cb]
     * @returns {*}
     */
    ready(cb?: Function): any {
        if (!cb)
            return this.keyPromise;
        else {
            this.keyPromise.then(cb)
                .catch(() => { throw "Ready function failed"; });
            return;
        }
    }

    /** 
     * Encryptor constructtor
     * @formPubKey: the form public key (EC P-256), Base64 encoded
     */
    constructor(formPubKey: string) {
        this.importKey(formPubKey);
    }
}

// }
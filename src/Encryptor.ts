/// <reference path="../typings/index.d.ts" />
/// <reference path="base64.ts" />

import { Converters as conv } from "./base64.ts";

// module tiForms {

    export interface EncryptedData {
        pubKey: string; // The public EC P-256 key as a Base64
        payload: string; // The encrypted payload as AES-256 CBC with IV=0. Key is derived usin Diffie-Helman 
    }


    export class Encryptor {
        private formKey: CryptoKey;

        /**
         * Method encrypts a given string.
         * @returns: Promise fulfilled when encryption is complete
         */
        encryptString(data: string) {
            // Create a private key
            return crypto.subtle.generateKey(
                {
                    "name": "ECDH",
                    "namedCurve": "P-256"
                } as Algorithm,
                false /* make key not extractable */,
                ["deriveKey"] /* Only need key derivation */)
                .then(function (privKey: CryptoKey) {
                    return crypto.subtle.deriveKey(
                        {
                            "name": "ECDH",
                            "namedCurve": "P-256",
                            "public": this.formKey
                        } as Algorithm,
                        privKey,
                        {
                            "name": 'AES-CBC',
                            "length": 256
                        } as Algorithm,
                        false, ["encrypt"])
                        .then(function (encryptor) {


                        });
                })
        }

        /**
         * Version of encryptString with callbacks as arguments
         * @success is provided with an object of type arguments
         * @fail is provided the error
         */
        encryptStringCB(data: string, success: Function, fail: Function){
            this.encryptString(data).then(success, fail);
        }

        /** 
         * Encryptor constructtor
         * @formPubKey: the form public key (EC P-256), Base64 encoded
         */
        constructor(formPubKey: string) {
            this.formKey = crypto.subtle.importKey(
                "raw", conv.base64toUint8Array(formPubKey), 
                {
                    "name": "ECDH",
                    "namedCurve": "P-256"
                } as Algorithm,
                false, ['deriveKey']
            );

        }
    }

// }
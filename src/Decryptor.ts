/// <reference path="../typings/index.d.ts" />
/// <reference path="base64.ts" />
/// <reference path="Encryptor.ts" />

import { Converters as conv } from "./base64.ts";
import { EncryptedData } from "./Encryptor.ts";

// module tiForms {

    /**
     * Interface to encapsulate key pairs encoded in external formats
     */
    export interface ExternalKeyPair {
        pubKey: string;
        privKey: string;
    }

    export class Decryptor {
        private privKey: CryptoKey;

        static generateKey(){
            var outKey: ExternalKeyPair = {
                pubKey: undefined,
                privKey: undefined
            }
            return crypto.subtle.generateKey(
                {
                    name: "ECDH",
                    namedCurve: "P-256"
                } as Algorithm,
                true,
                []
            ).then( function(key: CryptoKeyPair){
                return crypto.subtle.exportKey("pkcs8", key.privateKey)
                    .then( function(privRaw: Uint8Array) {
                        outKey.privKey = conv.Uint8ArraytoBase64(privRaw);
                        return crypto.subtle.exportKey("raw", key.publicKey)
                            .then( function(pubRaw: Uint8Array){
                                outKey.pubKey = conv.Uint8ArraytoBase64(pubRaw);
                                return outKey;
                            })
                    });
            });
        }

        /**
         * Method to load a key. 
         * @privKey: the base64 pkcs8 encoded private key
         * @returns: promise that resolves when the key is loaded
         */
        importKey(privKey:string){
            var that = this;
            var privRaw = conv.base64toUint8Array(privKey);
            return crypto.subtle.importKey('pkcs8', privRaw, 
            {
                name: "ECDH",
                namedCurve: "P-256"
            } as Algorithm,
            false,
            ['deriveKey', 'deriveBits']
            ).then( function(privateKey: CryptoKey){
                that.privKey = privateKey;
                return;
            });
        }

        decryptString(data: EncryptedData): string{
            return "something";
        }

        // Constructor does nothing. Must call importKey to build
        constructor(){

        }
    }

// }
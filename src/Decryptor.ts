/// <reference path="../typings/index.d.ts" />
/// <reference path="Converters.ts" />
/// <reference path="Encryptor.ts" />

import { Converters as conv } from "./Converters.ts";
import { EncryptedData } from "./Encryptor.ts";

// module tiForms {

/**
 * Interface to encapsulate key pairs encoded in external formats
 */
export interface ExternalKeyPair {
    pubKey: string;
    privKey: string;
}

/**
 * Decryptor simplifies decryption of messages. It is also responsible for key
 * generation.
 * 
 * The generated key has the private part represented in base64(pkcs8)
 * and the public part as the concatenation (with | as separator) of the x,y
 * coordinates of the P-256 points in teh "jwk" representation.
 */
export class Decryptor {
    private privKey: CryptoKey;
    private keyPromise: any;

    static pubKey: any;

    static generateKey() {
        var outKey: ExternalKeyPair = {
            pubKey: undefined,
            privKey: undefined
        }
        return crypto.subtle.generateKey(
            { name: "ECDH", namedCurve: "P-256" } as Algorithm,
            true,
            ['deriveKey']
        ).then(function (key: CryptoKeyPair) {
            return crypto.subtle.exportKey("jwk", key.privateKey)
                .then(function (keyObj: any) {
                    return {
                        pubKey: conv.jwkToString(keyObj, true),
                        privKey: conv.jwkToString(keyObj),
                    };
/*                    outKey.privKey = conv.Uint8ArrayToBase64(new Uint8Array(privRaw));
                    return crypto.subtle.exportKey("jwk", key.publicKey)
                        .then(function (pubObj: any) {
                            console.log("PubKey:", pubObj);
                            pubObj.key_ops = ['deriveKey'];
                            Decryptor.pubKey = pubObj;
                            outKey.pubKey = [pubObj.x, pubObj.y].join('|');
                            return outKey;
                        })
*/                        
                });
        });
    }

    /**
     * Method to load a key. 
     * @privKey: the base64 pkcs8 encoded private key
     * @returns: promise that resolves when the key is loaded
     */
    importKey(privKey: string) {
        var that = this;
        this.keyPromise = crypto.subtle.importKey(
            'jwk', conv.stringToJwk(privKey),
            {
                name: "ECDH",
                namedCurve: "P-256"
            } as Algorithm,
            false,
            ['deriveKey']
        ).then(function (privateKey: CryptoKey) {
            that.privKey = privateKey;
            return;
        });
    }

    decryptString(data: EncryptedData){
        var that = this;
        var sData = conv.base64ToUint8Array(data.payload);
        return crypto.subtle.importKey(
            "jwk", conv.stringToJwk(data.pubKey),
            { name: "ECDH", namedCurve: "P-256" } as Algorithm,
            false,
            [/*"deriveKey"*/]
        ).then((pubKey: CryptoKey) => {
            return crypto.subtle.deriveKey(
                { name: "ECDH", namedCurve: "P-256", public: pubKey } as Algorithm,
                that.privKey,
                { name: 'AES-CBC', length: 256 } as Algorithm,
                false, ["decrypt"]
            ).then((aesKey: CryptoKey) => {
                return crypto.subtle.decrypt(
                    { name: 'AES-CBC', iv: new Uint8Array(16) } as Algorithm,
                    aesKey, sData
                ).then((decrypted: Uint8Array) => {
                    return conv.Uint8ArrayToString(new Uint8Array(decrypted));
                })
            });
        });
    }

    /**
     * Method that allows  correct chainging of decryption related activieties 
     * 
     * @param {Function} [cb] Callback function to call. If not present, returns
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

    constructor(privKey: string) {
        this.importKey(privKey);
    }
}
// }
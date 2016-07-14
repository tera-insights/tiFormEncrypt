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
            ['deriveKey', 'deriveBits']
        ).then(function (key: CryptoKeyPair) {
            return crypto.subtle.exportKey("pkcs8", key.privateKey)
                .then(function (privRaw: Uint8Array) {
                    outKey.privKey = conv.Uint8ArrayToBase64(new Uint8Array(privRaw));
                    return crypto.subtle.exportKey("jwk", key.publicKey)
                        .then(function (pubObj: any) {
                            console.log("PubKey:", pubObj);
                            pubObj.key_ops = ['deriveKey'];
                            Decryptor.pubKey = pubObj;
                            outKey.pubKey = [pubObj.x, pubObj.y].join('|');
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
    importKey(privKey: string) {
        var that = this;
        var privRaw = conv.base64ToUint8Array(privKey);
        this.keyPromise = crypto.subtle.importKey('pkcs8', privRaw,
            {
                name: "ECDH",
                namedCurve: "P-256"
            } as Algorithm,
            false,
            ['deriveKey', 'deriveBits']
        ).then(function (privateKey: CryptoKey) {
            that.privKey = privateKey;
            return;
        });
    }

    decryptString(data: EncryptedData): string {
        var that = this;
        var pubRaw = conv.base64ToUint8Array(data.pubKey);
        var sData = conv.base64ToUint8Array(data.payload);
        return crypto.subtle.importKey(
            "raw", pubRaw,
            { name: "ECDH", namedCurve: "P-256" } as Algorithm,
            false,
            ["deriveKey", "deriveBits"]
        ).then((pubKey: CryptoKey) => {
            return crypto.subtle.deriveKey(
                { name: "ECDH", namedCurve: "P-256", public: pubKey } as Algorithm,
                that.privKey,
                { name: 'AES-CBC', length: 256 } as Algorithm,
                false, ["deriveKey"]
            ).then((aesKey: CryptoKey) => {
                crypto.subtle.decrypt(
                    { name: 'AES-CBC', iv: new Uint8Array(16) } as Algorithm,
                    aesKey, sData
                ).then((decrypted: Uint8Array) => {
                    return conv.Uint8ArrayToString(decrypted);
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

    // Constructor does nothing. Must call importKey to build
    constructor(privKey: string) {
        this.importKey(privKey);
    }
}
// }
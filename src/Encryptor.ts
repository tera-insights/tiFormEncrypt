import { Converters as conv } from "./Converters";
import { Decryptor } from "./Decryptor";
import { EncryptedData } from "./EncryptedData";

// module tiForms {

export class Encryptor {
    private formKey: CryptoKey;
    private keyPromise: any;

    /**
     * Method encrypts a given binary blob. 
     * @returns: Promise fulfilled when encryption is complete that returns the 
     *  data 
     */
    encryptBinary(data: Uint8Array) {
        var that = this;
        var encData: EncryptedData = { pubKey: undefined, payload: undefined };
        // Create a private key
        return crypto.subtle.generateKey(
            { name: "ECDH", namedCurve: "P-256" } as any,
            false /* make key not extractable */,
            ["deriveKey"] /* Only need key derivation */)
            .then(function (key: CryptoKeyPair) {
                return crypto.subtle.deriveKey(
                    {
                        name: "ECDH", namedCurve: "P-256", "public": that.formKey
                    } as any,
                    key.privateKey,
                    { name: 'AES-CBC', length: 256 },
                    false, ["encrypt"])
                    .then(function (aesKey: CryptoKey) {
                        return crypto.subtle.encrypt(
                            { name: 'AES-CBC', iv: new Uint8Array(16) } as Algorithm,
                            aesKey, data
                        ).then(encrypted=> {
                            encData.payload = conv.Uint8ArrayToBase64(
                                new Uint8Array(encrypted));
                            return crypto.subtle.exportKey('jwk', key.publicKey)
                                .then((pubObj) => {
                                    encData.pubKey = [pubObj.x, pubObj.y].join('|');
                                    return encData;
                                })
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
    encryptStringCB(data: string,
        success: (val: EncryptedData) => void,
        fail: (reason: any) => void) {
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
            "jwk", conv.stringToJwk(pubKey),
            { name: "ECDH", namedCurve: "P-256" },
            false, [/*'deriveKey'*/]
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
/// <reference path="../typings/index.d.ts" />

import { Converters as conv } from "./Converters";
import { DecryptorShim } from "./DecryptorShim";
import { EncryptedData } from "./EncryptedData";
import { PrivECC, PubECC } from "./ECC";
import * as Promise from "promise";

export class EncryptorShim {
    private formKey: PubECC;

    /**
     * Method encrypts a given binary blob. 
     * @returns: Promise fulfilled when encryption is complete that returns the 
     *  data 
     */
    encryptBinary(data: Uint8Array) {
        var that = this;
        var encData: EncryptedData = { pubKey: undefined, payload: undefined };

        var key = new PrivECC();
        encData.pubKey = key.exportPublic();
        var aesSecret: Uint8Array = key.ECDH(this.formKey);

        return crypto.subtle.importKey(
            "raw",
            aesSecret,
            {
                name: "AES-CBC",
                length: 256
            } as Algorithm,
            false,
            ["encrypt"]
        ).then((aesKey: CryptoKey) => {
            return crypto.subtle.encrypt(
                { name: 'AES-CBC', iv: new Uint8Array(16) } as Algorithm,
                aesKey, data
            ).then((encrypted: Uint8Array) => {
                encData.payload = conv.Uint8ArrayToBase64(
                    new Uint8Array(encrypted));
                return encData;
            });
        });
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
    importKey(pubKeyStr: string) {
        this.formKey = new PubECC(pubKeyStr);
    }

    /**
     * Method that allows  correct chainging of decryption related activieties 
     * 
     * @param {Function} [cb]
     * @returns {*}
     */
    ready(cb?: Function): any {
        if (!cb)
            return Promise.resolve(undefined); 
        else { // call imediatelly
            cb();
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

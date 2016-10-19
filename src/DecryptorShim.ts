/// <reference path="../typings/index.d.ts" />

import { Converters as conv } from "./Converters";
import { EncryptedData } from "./EncryptedData";
import { PrivECC, PubECC } from "./ECC";
import * as Promise from "promise";

export class DecryptorShim {
    private privKey: PrivECC;
    private keyPromise: any;

    static pubKey: any;

    static generateKey() {
        return new Promise(function (fulfill, reject) {
            var privKey = new PrivECC();
            fulfill({
                privKey: privKey.exportPrivate(),
                pubKey: privKey.exportPublic()
            })

        });
    }

    importKey(privKey: string) {
        this.privKey = new PrivECC(privKey);
    }

    decryptString(data: EncryptedData) {
        var that = this;
        var sData = conv.base64ToUint8Array(data.payload);

        var pubKey = new PubECC(data.pubKey);
        var aesSecret: Uint8Array = this.privKey.ECDH(pubKey);

        return crypto.subtle.importKey(
            "raw",
            aesSecret,
            {
                name: "AES-CBC"
            },
            false,
            ["decrypt"]
        ).then((aesKey: CryptoKey) => {
            return crypto.subtle.decrypt(
                { name: 'AES-CBC', iv: new Uint8Array(16) } as Algorithm,
                aesKey, sData
            ).then((decrypted: Uint8Array) => {
                return conv.Uint8ArrayToString(new Uint8Array(decrypted));
            });
        });
    }

    ready(cb?: Function): any {
        if (!cb)
            return Promise.resolve(undefined);  
        else { // call imediatelly
            cb();
            return;
        }
    }

    constructor(privKey: string) {
        this.importKey(privKey);
    }
}
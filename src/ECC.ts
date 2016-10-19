/// <reference path="../typings/index.d.ts" />
/// <reference path="./Converters.ts" />

/**
 * This file contains ECC key manipulation
 */

import { Converters as conv } from "./Converters";
var EC: any = require('elliptic').ec;

export class PubECC {
    private keyPair: any;

    static exportPublic(keyPair: any): string {
        var pubKeyRaw: Uint8Array = new Uint8Array(keyPair.getPublic('raw'));
        var pX = pubKeyRaw.subarray(1, 33);
        var pY = pubKeyRaw.subarray(33, 65);
        //console.log(pubKeyRaw.byteLength, pX.byteLength, pY.byteLength, pX, pY);
        return conv.base64ToBase64URL(conv.Uint8ArrayToBase64(pX)) +
            "|" +
            conv.base64ToBase64URL(conv.Uint8ArrayToBase64(pY));
    }

    export(): string {
        return PubECC.exportPublic(this.keyPair);
    }

    getKey() {
        return this.keyPair.getPublic();
    }

    constructor(ext: string) {
        var pubKeyParts = ext.split('|');
        var pX: Uint8Array = conv.base64ToUint8Array(
            conv.base64URLToBase64(pubKeyParts[0])
        );
        var pY: Uint8Array = conv.base64ToUint8Array(
            conv.base64URLToBase64(pubKeyParts[1])
        );
        var pubKey = new Uint8Array(65);
        pubKey[0] = 4;
        pubKey.set(pX, 1);
        pubKey.set(pY, 33);

        var ec = new EC('p256');
        this.keyPair = ec.keyFromPublic(pubKey);
    }

}

export class PrivECC {
    private keyPair: any;

    ECDH(pubKey: PubECC): Uint8Array {
        var hexKey:string = this.keyPair.derive(pubKey.getKey()).toString(16);
        if (hexKey.length < 64 ){
            var pad = "";
            for (var i=hexKey.length; i<64; i++)
                pad += "0";
            hexKey = pad+hexKey;
        }
             
        var res = conv.hexToBytes(hexKey);
        if (res.byteLength != 32)
            console.log("AES-FAIL", res.byteLength, res);
        
        return res;
    }

    exportPrivate(): string {
        return this.exportPublic() + '|' +
            conv.base64ToBase64URL(
                conv.Uint8ArrayToBase64(
                    conv.hexToBytes(
                        this.keyPair.getPrivate('hex')
                    )
                )
            );
    }

    exportPublic(): string {
        if (this.keyPair) {
            return PubECC.exportPublic(this.keyPair);
        } else {
            return undefined;
        }
    }

    /**
     * Creates an instance of PrivECC. 
     * 
     * @param {string} [ext] If present, key is loaded from external rep
     *                       If not present, key is genertated
     */
    constructor(ext?: string) {
        if (ext) { // load
            var keyParts = ext.split('|');
            var ec = new EC('p256');
            this.keyPair = ec.keyFromPrivate(
                conv.base64ToUint8Array(
                    conv.base64URLToBase64(keyParts[2])
                )
            );
        } else { // generate
            // generate our own key since we have a good PRNG
            var privKey = new Uint8Array(32);
            crypto.getRandomValues(privKey);

            var ec = new EC('p256');
            this.keyPair = ec.keyFromPrivate(privKey);
        }
    }
}
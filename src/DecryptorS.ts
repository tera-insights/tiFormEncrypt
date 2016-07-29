/// <reference path="../typings/index.d.ts" />
/// <reference path="Converters.ts" />
/// <reference path="Encryptor.ts" />

import { Converters as conv } from "./Converters.ts";
import { EncryptedData } from "./Encryptor.ts";
// ECHD functions are missing from node.d.ts sowe are forced to do this.
var crypto: any = require('crypto');

function pubKeyToBuffer(pubKey:string): Buffer {
    var keyParts = pubKey.split('|');
    // Buffer can deal with base64URL directly
    var head = new Buffer([0x04]);
    var x = Buffer.from(keyParts[0], 'base64');
    var y = Buffer.from(keyParts[0], 'base64');
    return Buffer.concat([head, x, y], 65);
}

/**
 * NodeJS version of the decryptor. Does not support key generation.
 * 
 * NOTE: this class is synchronous. It does not need to use promises 
 * sinde the NodeJS crypto API is synchronous.
 * 
 * @export
 * @class Decryptor
 */

export class Decryptor {
    private privKey: any;
    /**
     * Method to load a key. 
     * @privKey: the base64 pkcs8 encoded private key
     * @returns: promise that resolves when the key is loaded
     */
    importKey(privKey: string) {
        this.privKey = crypto.createECDH('secp256k1');
        var keyParts = privKey.split('|');
        var xB64 =  conv.base64URLToBase64(keyParts[0]);
        var yB64 =  conv.base64URLToBase64(keyParts[1]);
        this.privKey.setPrivateKey(conv.base64URLToBase64(keyParts[2]),'base64');        
    };

    decryptString(data: EncryptedData){
        var secret = this.privKey.computerSecret(pubKeyToBuffer(data.pubKey));
        var cypher = crypto.createDecipher('aes-256-cbc', secret);
        var decrypted = cypher.update(data.payload, 'base64', 'utf8');
        decrypted += cypher.final('utf8');
        return decrypted;
    }

    constructor(privKey: string) {
        this.importKey(privKey);
    }
}
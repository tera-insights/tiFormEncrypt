import { EncryptedData } from "../Interfaces";
import { createECDH, createDecipheriv, ECDH } from "crypto";
import { Base64 } from "../encoding/Base64";

function pubKeyToBuffer(pubKey:string): Uint8Array {
    // Buffer can deal with URL-safe Base64 directly
    const
        keyParts = pubKey.split("|"),
        head = new Buffer([0x04]),
        x = Buffer.from(keyParts[0], "base64"), 
        y = Buffer.from(keyParts[1], "base64");
    return Buffer.concat([head, x, y], 65);
}

/**
 * NodeJS version of the decryptor. Does not support key generation.
 * 
 * NOTE: this class is synchronous. It does not need to use promises 
 * sinde the NodeJS crypto API is synchronous.
 */
export class DecryptorNode
{
    private readonly privKey: ECDH;

    decryptString(data: EncryptedData): string
    {
        const
            secret = this.privKey.computeSecret(pubKeyToBuffer(data.pubKey)),
            iv = Buffer.alloc(16, 0),
            cipher = createDecipheriv("aes-256-cbc", secret, iv);

        let decrypted = cipher.update(data.payload, "base64", "utf8");
        decrypted += cipher.final("utf8");
        return decrypted;
    }

    /**
     * @param privKey The 3-part tiForms private key, in the form:
     *                `base64URL(x)|base64URL(y)|base64URL(d)`
     */
    constructor(privKey: string) {
        const keyParts = privKey.split("|");
        const dBase64 = Base64.makeStandard(keyParts[2]);
        this.privKey = createECDH("prime256v1");
        this.privKey.setPrivateKey(dBase64, 'base64');
    }

}
import { Decryptor } from "./Decryptor";
import { ExternalKeyPair } from "../Interfaces";
import { jwkToTiFormsKey, tiFormsKeyToJWK, tiFormsPubKeyToJWK } from "../encoding/misc";

export class DecryptorSubtle extends Decryptor {

    static genKey(): PromiseLike<ExternalKeyPair> {
        return crypto.subtle.generateKey({
            name: "ECDH",
            namedCurve: "P-256"
        }, true, ["deriveKey"]).then(pair => {
            return crypto.subtle.exportKey("jwk", pair.privateKey).then(jwk => ({
                pubKey: jwkToTiFormsKey(jwk, true),
                privKey: jwkToTiFormsKey(jwk)
            }));
        });
    }

    static fromPrivate(keyStr: string, pubKey: string): PromiseLike<Decryptor> {
        return crypto.subtle.importKey("jwk", tiFormsKeyToJWK(keyStr, pubKey), {
            name: "ECDH",
            namedCurve: "P-256"
        }, false, ["deriveKey"]).then(key => new DecryptorSubtle(key));
    }

    async decrypt(edata: Uint8Array, extPub: string, iv = new Uint8Array(16)): Promise<Uint8Array> {
        const pubKey = await crypto.subtle.importKey("jwk", tiFormsPubKeyToJWK(extPub), {
            name: "ECDH",
            namedCurve: "P-256"
        }, false, []);

        const aesKey = await crypto.subtle.deriveKey({
            name: "ECDH",
            namedCurve: "P-256",
            public: pubKey
        } as any, this.privKey, {
            name: "AES-CBC",
            length: 256
        }, false, ["decrypt"]);

        const decrypted = await crypto.subtle.decrypt({
            name: "AES-CBC",
            iv: iv
        }, aesKey, edata);

        return new Uint8Array(decrypted);
    }

    private constructor(private privKey: CryptoKey) {
        super();
    }

}
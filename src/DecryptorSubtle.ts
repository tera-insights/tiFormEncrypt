import { jwkToString, stringToJwk } from "./Converters";
import { Decryptor } from "./Decryptor";
import { ExternalKeyPair } from "./Interfaces";

export class DecryptorSubtle extends Decryptor {

    static genKey(): PromiseLike<ExternalKeyPair> {
        return crypto.subtle.generateKey({
            name: "ECDH",
            namedCurve: "P-256"
        }, true, ["deriveKey"]).then(pair => {
            return crypto.subtle.exportKey("jwk", pair.privateKey).then(jwk => ({
                pubKey: jwkToString(jwk, true),
                privKey: jwkToString(jwk)
            }));
        });
    }

    static fromPrivate(formPrivate: string): PromiseLike<Decryptor> {
        return crypto.subtle.importKey("jwk", stringToJwk(formPrivate), {
            name: "ECDH",
            namedCurve: "P-256"
        }, false, ["deriveKey"]).then(key => new DecryptorSubtle(key));
    }

    protected async _decrypt(edata: Uint8Array, extPub: string): Promise<Uint8Array> {
        const pubKey = await crypto.subtle.importKey("jwk", stringToJwk(extPub), {
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
            iv: new Uint8Array(16)
        }, aesKey, edata);

        return new Uint8Array(decrypted);
    }

    private constructor(private privKey: CryptoKey) {
        super();
    }

}
import { ExternalKeyPair, EncryptedData } from "./Interfaces";
import { Decryptor } from "./Decryptor";
import { jwkToTiFormsKey, tiFormsKeyToJWK, binaryToString } from "./encoding/misc";
import { Base64 } from "./encoding/Base64";

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

    static fromPrivate(formPrivate: string): PromiseLike<Decryptor> {
        return crypto.subtle.importKey("jwk", tiFormsKeyToJWK(formPrivate), {
            name: "ECDH",
            namedCurve: "P-256"
        }, false, ["deriveKey"]).then(key => new DecryptorSubtle(key));
    }

    decrypt(data: EncryptedData, out?: "binary"): PromiseLike<Uint8Array>;
    decrypt(data: EncryptedData, out: "string"): PromiseLike<string>;
    decrypt(data: EncryptedData, out: "binary" | "string" = "binary"): PromiseLike<Uint8Array | string> {
        return crypto.subtle.importKey("jwk", tiFormsKeyToJWK(data.pubKey), {
            name: "ECDH",
            namedCurve: "P-256"
        }, false, []).then(pubKey => {
            return crypto.subtle.deriveKey({
                name: "ECDH",
                namedCurve: "P-256",
                public: pubKey
            } as any, this.privKey, {
                name: 'AES-CBC',
                length: 256
            }, false, ["decrypt"]).then(aesKey => {
                return crypto.subtle.decrypt({
                    name: 'AES-CBC',
                    iv: new Uint8Array(16)
                }, aesKey, Base64.decode(data.payload)).then(decrypted => {
                    const binary = new Uint8Array(decrypted);
                    return out === "binary" ? binary : binaryToString(binary);
                });
            });
        });
    }

    private constructor(private privKey: CryptoKey) {
        super();
    }

}
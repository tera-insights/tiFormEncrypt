import { EncryptedData } from "../Interfaces";
import { Encryptor } from "./Encryptor";
import { tiFormsKeyToJWK, stringToBinary, jwkToTiFormsKey } from "../encoding/misc";
import { Base64 } from "../encoding/Base64";

export class EncryptorSubtle extends Encryptor {

    static fromPublic(publicKey: string): PromiseLike<Encryptor> {
        return crypto.subtle.importKey("jwk", tiFormsKeyToJWK(publicKey), {
            name: "ECDH",
            namedCurve: "P-256"
        }, false, []).then(key => new EncryptorSubtle(key));
    }

    /**
     * Encrypt data using the form public key.
     */
    encrypt(data: Uint8Array | string): PromiseLike<EncryptedData> {
        const binary = typeof data === "string" ? stringToBinary(data) : data;
        return crypto.subtle.generateKey({
            name: "ECDH",
            namedCurve: "P-256"
        }, false, ["deriveKey"]).then(ecPair => {
            return crypto.subtle.deriveKey({
                name: "ECDH",
                namedCurve: "P-256",
                public: this.formKey
            } as any, ecPair.privateKey, {
                name: "AES-CBC",
                length: 256
            }, false, ["encrypt"]).then(aesKey => {
                return crypto.subtle.encrypt({
                    name: "AES-CBC",
                    iv: new Uint8Array(16)
                }, aesKey, binary).then(encrypted => {
                    return crypto.subtle.exportKey("jwk", ecPair.publicKey).then(jwk => ({
                        pubKey: jwkToTiFormsKey(jwk),
                        payload: Base64.encode(new Uint8Array(encrypted))
                    }));
                });
            });
        });
    }

    private constructor(private formKey: CryptoKey) {
        super();
    }

}
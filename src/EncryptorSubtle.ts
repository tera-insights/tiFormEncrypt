import { EncryptedData } from "./Interfaces";
import { Encryptor, SuccessCallback, FailureCallback } from "./Encryptor"
import { stringToJwk, stringToBinary, binaryToBase64 } from "./Converters";

export class EncryptorSubtle extends Encryptor {

    static fromPublic(publicKey: string): PromiseLike<Encryptor> {
        return crypto.subtle.importKey("jwk", stringToJwk(publicKey), {
            name: "ECDH",
            namedCurve: "P-256"
        }, false, []).then(key => new EncryptorSubtle(key));
    }

    /**
     * Encrypt data using the form public key.
     */
    encrypt(data: Uint8Array | string): PromiseLike<EncryptedData>;
    encrypt(data: Uint8Array | string, onsuccess: SuccessCallback, onfailure: FailureCallback): void;
    encrypt(
        data: Uint8Array | string,
        onsuccess?: SuccessCallback,
        onfailure?: FailureCallback
    ): void | PromiseLike<EncryptedData> {
        const binData = typeof data === "string" ? stringToBinary(data) : data;
        const promise: PromiseLike<EncryptedData> = crypto.subtle.generateKey({
            name: "ECDH",
            namedCurve: "P-256"
        }, false, ["deriveKey"]).then(ecPair => {
            return crypto.subtle.deriveKey({
                name: "ECDH",
                namedCurve: "P-256",
                public: this.formKey
            } as any, ecPair.privateKey, {
                name: 'AES-CBC',
                length: 256
            }, false, ["encrypt"]).then(aesKey => {
                return crypto.subtle.encrypt({
                    name: 'AES-CBC',
                    iv: new Uint8Array(16)
                }, aesKey, binData).then(encrypted => {
                    return crypto.subtle.exportKey('jwk', ecPair.publicKey).then(extPublic => ({
                        pubKey: [extPublic.x, extPublic.y].join('|'),
                        payload: binaryToBase64(new Uint8Array(encrypted))
                    }));
                });
            });
        });

        if (!onsuccess)
            return promise;
        if (!onfailure)
            onfailure = err => console.error("Unhandled error in Encryptor.encrypt():", err);
        promise.then(onsuccess, onfailure);
    }

    private constructor(private formKey: CryptoKey) {
        super();
    }

}
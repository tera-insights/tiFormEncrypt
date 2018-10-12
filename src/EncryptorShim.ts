import { PrivECC, PubECC } from "./ECC";
import { EncryptedData } from "./Interfaces";
import { Encryptor, FailureCallback, SuccessCallback } from "./Encryptor";
import { stringToBinary, binaryToBase64 } from "./Converters";

export class EncryptorShim extends Encryptor {

    static fromPublic(publicKey: string): PromiseLike<Encryptor> {
        return new Promise<Encryptor>((resolve, reject) => {
            try {
                resolve(new EncryptorShim(new PubECC(publicKey)));
            } catch (error) {
                reject(error);
            }
        });
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
        const privateKey = new PrivECC();
        const aesSecret = privateKey.ECDH(this.formKey);
        const promise = crypto.subtle.importKey("raw", aesSecret, {
            name: "AES-CBC",
            length: 256
        }, false, ["encrypt"]).then(aesKey => {
            return crypto.subtle.encrypt({
                name: 'AES-CBC',
                iv: new Uint8Array(16)
            }, aesKey, binData).then(encrypted => (<EncryptedData>{
                pubKey: privateKey.exportPublic(),
                payload: binaryToBase64(new Uint8Array(encrypted))
            }));
        });

        if (!onsuccess)
            return promise;
        if (!onfailure)
            onfailure = err => console.error("Unhandled error in Encryptor.encrypt():", err);
        promise.then(onsuccess, onfailure);
    }

    private constructor(private formKey: PubECC) {
        super();
    }

}

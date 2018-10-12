import { ExternalKeyPair, EncryptedData } from "./Interfaces";
import { PrivECC, PubECC } from "./ECC";
import { Decryptor } from "./Decryptor";
import { base64ToBinary, binaryToString } from "./Converters";

export class DecryptorShim extends Decryptor {

    static genKey(): PromiseLike<ExternalKeyPair> {
        return new Promise<ExternalKeyPair>((resolve, reject) => {
            try {
                const pair = new PrivECC();
                resolve({
                    privKey: pair.exportPrivate(),
                    pubKey: pair.exportPublic()
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    static fromPrivate(formPrivate: string): PromiseLike<Decryptor> {
        return new Promise<Decryptor>((resolve, reject) => {
            try {
                resolve(new DecryptorShim(new PrivECC(formPrivate)));
            } catch (error) {
                reject(error);
            }
        });
    }

    decrypt(data: EncryptedData, out?: "binary"): PromiseLike<Uint8Array>;
    decrypt(data: EncryptedData, out: "string"): PromiseLike<string>;
    decrypt(data: EncryptedData, out: "binary" | "string" = "binary"): PromiseLike<Uint8Array | string> {
        const encrypted = base64ToBinary(data.payload);
        const pubKey = new PubECC(data.pubKey);
        const aesSecret = this.privKey.ECDH(pubKey);

        return crypto.subtle.importKey("raw", aesSecret, {
            name: "AES-CBC",
            length: 256
        }, false, ["decrypt"]).then(aesKey => {
            return crypto.subtle.decrypt({
                name: 'AES-CBC',
                iv: new Uint8Array(16)
            }, aesKey, encrypted).then(decrypted => {
                const binary = new Uint8Array(decrypted);
                return out === "binary" ? binary : binaryToString(binary);
            });
        });
    }

    private constructor(private privKey: PrivECC) {
        super();
    }

}
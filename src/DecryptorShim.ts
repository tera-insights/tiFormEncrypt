import { Decryptor } from "./Decryptor";
import { PrivECC, PubECC } from "./ECC";
import { ExternalKeyPair } from "./Interfaces";

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

    protected async _decrypt(edata: Uint8Array, extPub: string): Promise<Uint8Array> {
        const aesSecret = this.privKey.ECDH(new PubECC(extPub));

        const aesKey = await crypto.subtle.importKey("raw", aesSecret, {
            name: "AES-CBC",
            length: 256
        }, false, ["decrypt"]);

        const decrypted = await crypto.subtle.decrypt({
            name: "AES-CBC",
            iv: new Uint8Array(16)
        }, aesKey, edata);

        return new Uint8Array(decrypted);
    }

    private constructor(private privKey: PrivECC) {
        super();
    }

}
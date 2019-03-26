import { ExternalKeyPair, EncryptedData } from "./Interfaces";
import { ECPrivate, ECPublic } from "./EC";
import { Decryptor } from "./Decryptor";
import { Base64 } from "./encoding/Base64";
import { binaryToString } from "./encoding/misc";
import { Promise } from "es6-promise";
import * as aes from "aes-js";

export class DecryptorShim extends Decryptor {

    static genKey(): PromiseLike<ExternalKeyPair> {
        return new Promise<ExternalKeyPair>((resolve, reject) => {
            try {
                const pair = new ECPrivate();
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
                resolve(new DecryptorShim(new ECPrivate(formPrivate)));
            } catch (error) {
                reject(error);
            }
        });
    }

    decrypt(data: EncryptedData, out?: "binary"): PromiseLike<Uint8Array>;
    decrypt(data: EncryptedData, out: "string"): PromiseLike<string>;
    decrypt(data: EncryptedData, out: "binary" | "string" = "binary"): PromiseLike<Uint8Array | string> {
        const encrypted = Base64.decode(data.payload);
        const pubKey = new ECPublic(data.pubKey);
        const aesSecret = this.privKey.ecdh(pubKey);
        const aesCipher = new aes.ModeOfOperation.cbc(aesSecret, new Uint8Array(16));
        const decrypted = aesCipher.decrypt(encrypted);

        return Promise.resolve(
            out === "binary"
                ? decrypted
                : binaryToString(decrypted)
        );
    }

    private constructor(private privKey: ECPrivate) {
        super();
    }

}
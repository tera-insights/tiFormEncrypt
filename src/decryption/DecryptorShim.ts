import { ExternalKeyPair, EncryptedData } from "../Interfaces";
import { ECPrivate, ECPublic } from "../EC";
import { Decryptor } from "./Decryptor";
import { Base64 } from "../encoding/Base64";
import { binaryToString } from "../encoding/misc";
import { ModeOfOperation as aes } from "aes-js";
import { Shim } from "../Shim";

export class DecryptorShim extends Decryptor {

    static genKey(): PromiseLike<ExternalKeyPair> {
        return new Shim.Promise<ExternalKeyPair>(resolve => {
            const pair = new ECPrivate();
            resolve({
                privKey: pair.exportPrivate(),
                pubKey: pair.exportPublic()
            });
        });
    }

    static fromPrivate(formPrivate: string): PromiseLike<Decryptor> {
        return new Shim.Promise<Decryptor>(resolve => {
            resolve(new DecryptorShim(new ECPrivate(formPrivate)));
        });
    }

    decrypt(data: EncryptedData, out?: "binary"): PromiseLike<Uint8Array>;
    decrypt(data: EncryptedData, out: "string"): PromiseLike<string>;
    decrypt(data: EncryptedData, out: "binary" | "string" = "binary"): PromiseLike<Uint8Array | string> {
        return new Shim.Promise(resolve => {
            const
                encrypted = Base64.decode(data.payload),
                pubKey = new ECPublic(data.pubKey),
                aesSecret = this.privKey.ecdh(pubKey),
                aesCipher = new aes.cbc(aesSecret, new Uint8Array(16)),
                decrypted = aesCipher.decrypt(encrypted);
                
            resolve(
                out === "binary"
                    ? decrypted
                    : binaryToString(decrypted)
            );
        });
    }

    private constructor(private privKey: ECPrivate) {
        super();
    }

}
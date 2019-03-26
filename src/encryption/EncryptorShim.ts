import { ECPrivate, ECPublic } from "../EC";
import { EncryptedData } from "../Interfaces";
import { Encryptor } from "./Encryptor";
import { stringToBinary } from "../encoding/misc";
import { Base64 } from "../encoding/Base64";
import { ModeOfOperation as aes } from "aes-js";
import { Shim } from "../Shim";

export class EncryptorShim extends Encryptor {

    static fromPublic(publicKey: string): PromiseLike<Encryptor> {
        return new Shim.Promise(resolve => {
            resolve(new EncryptorShim(new ECPublic(publicKey)));
        });
    }

    /**
     * Encrypt data using the form public key.
     */
    encrypt(data: Uint8Array | string): PromiseLike<EncryptedData> {
        return new Shim.Promise(resolve => {
            const
                binary = typeof data === "string" ? stringToBinary(data) : data,
                privateKey = new ECPrivate(),
                aesSecret = privateKey.ecdh(this.formKey),
                aesCipher = new aes.cbc(aesSecret, new Uint8Array(16)),
                encrypted = aesCipher.encrypt(binary);

            resolve({
                pubKey: privateKey.exportPublic(),
                payload: Base64.encode(encrypted)
            });
        });
    }

    private constructor(private formKey: ECPublic) {
        super();
    }

}

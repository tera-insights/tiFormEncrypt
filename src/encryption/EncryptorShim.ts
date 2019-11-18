import { ModeOfOperation as aes } from "aes-js";
import { ECPrivate, ECPublic } from "../EC";
import { Base64 } from "../encoding/Base64";
import { stringToBinary } from "../encoding/misc";
import { EncryptedData } from "../Interfaces";
import { Encryptor } from "./Encryptor";

export class EncryptorShim extends Encryptor {

    static async fromPublic(publicKey: string): Promise<Encryptor> {
        return new EncryptorShim(new ECPublic(publicKey));
    }

    /**
     * Encrypt data using the form public key.
     */
    async encrypt(data: Uint8Array | string): Promise<EncryptedData> {
        const
            binary = typeof data === "string" ? stringToBinary(data) : data,
            privateKey = new ECPrivate(),
            aesSecret = privateKey.ecdh(this.formKey),
            aesCipher = new aes.cbc(aesSecret, new Uint8Array(16)),
            encrypted = aesCipher.encrypt(binary);

        return {
            pubKey: privateKey.exportPublic(),
            payload: Base64.encode(encrypted)
        };
    }

    private constructor(private formKey: ECPublic) {
        super();
    }

}

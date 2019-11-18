import { ECPrivate, ECPublic } from "../EC";
import { ExternalKeyPair } from "../Interfaces";
import { Shim } from "../Shim";
import { Decryptor } from "./Decryptor";

export class DecryptorShim extends Decryptor {

    static async genKey(): Promise<ExternalKeyPair> {
        const pair = new ECPrivate();
        return {
            privKey: pair.exportPrivate(),
            pubKey: pair.exportPublic()
        };
    }

    static async fromPrivate(formPrivate: string): Promise<Decryptor> {
        return new DecryptorShim(new ECPrivate(formPrivate));
    }

    async decrypt(edata: Uint8Array, extPub: string, iv = new Uint8Array(16)): Promise<Uint8Array> {
        const aesSecret = this.privKey.ecdh(new ECPublic(extPub));

        const aesKey = await crypto.subtle.importKey("raw", aesSecret, {
            name: "AES-CBC",
            length: 256
        }, false, ["decrypt"]);

        const decrypted = await crypto.subtle.decrypt({
            name: "AES-CBC",
            iv: iv
        }, aesKey, edata);

        return new Uint8Array(decrypted);
    }

    private constructor(private privKey: ECPrivate) {
        super();
    }

}
import { Shim } from "./Shim";
import { EncryptedData, ExternalKeyPair } from "./Interfaces";
import { DecryptorSubtle } from "./DecryptorSubtle";
import { DecryptorShim } from "./DecryptorShim";

/**
 * Decryptor simplifies decryption of messages. It is also responsible for key
 * generation.
 * 
 * The generated key has the private part represented in base64(pkcs8)
 * and the public part as the concatenation (with | as separator) of the x,y
 * coordinates of the P-256 points in teh "jwk" representation.
 */
export abstract class Decryptor {

    static genKey(): PromiseLike<ExternalKeyPair> {
        return Shim.checkECDH().then(hasECDH => {
            return hasECDH ?
                DecryptorSubtle.genKey() :
                DecryptorShim.genKey();
        });
    }

    /**
     * Imports a form private key and creates a decryptor.
     */
    static fromPrivate(privateKey: string): PromiseLike<Decryptor> {
        return Shim.checkECDH().then(hasECDH => {
            return hasECDH ?
                DecryptorSubtle.fromPrivate(privateKey) :
                DecryptorShim.fromPrivate(privateKey);
        });
    }

    abstract decrypt(data: EncryptedData): PromiseLike<Uint8Array>;
    abstract decrypt(data: EncryptedData, out: "binary"): PromiseLike<Uint8Array>;
    abstract decrypt(data: EncryptedData, out: "string"): PromiseLike<string>;

}
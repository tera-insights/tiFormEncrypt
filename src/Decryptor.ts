import { EncryptedData } from "./Interfaces";

/**
 * Decryptor simplifies decryption of messages. It is also responsible for key
 * generation.
 * 
 * The generated key has the private part represented in base64(pkcs8)
 * and the public part as the concatenation (with | as separator) of the x,y
 * coordinates of the P-256 points in teh "jwk" representation.
 */
export abstract class Decryptor {

    abstract decrypt(data: EncryptedData): PromiseLike<Uint8Array>;
    abstract decrypt(data: EncryptedData, out: "binary"): PromiseLike<Uint8Array>;
    abstract decrypt(data: EncryptedData, out: "string"): PromiseLike<string>;

}
import { EncryptedData } from "./Interfaces";

/**
 * Decryptor simplifies decryption of messages. It is also responsible for key
 * generation.
 */
export abstract class Decryptor {

    abstract decrypt(data: EncryptedData): PromiseLike<Uint8Array>;
    abstract decrypt(data: EncryptedData, out: "binary"): PromiseLike<Uint8Array>;
    abstract decrypt(data: EncryptedData, out: "string"): PromiseLike<string>;

}

/**
 * Decryptor simplifies decryption of messages. It is also responsible for key
 * generation.
 */
export abstract class Decryptor {

    abstract decrypt(edata: Uint8Array, extPub: string, iv?: Uint8Array): PromiseLike<Uint8Array>;

}
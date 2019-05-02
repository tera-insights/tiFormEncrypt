
/**
 * Decryptor simplifies decryption of messages. It is also responsible for key
 * generation.
 * 
 * The generated key has the private part represented in base64(pkcs8)
 * and the public part as the concatenation (with | as separator) of the x,y
 * coordinates of the P-256 points in the "jwk" representation.
 */
export abstract class Decryptor {

    abstract decrypt(edata: Uint8Array, extPub: string, iv?: Uint8Array): PromiseLike<Uint8Array>;

}
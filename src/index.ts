import { Shim } from "./Shim";
import { Encryptor } from "./encryption/Encryptor";
import { EncryptorSubtle } from "./encryption/EncryptorSubtle";
import { EncryptorShim } from "./encryption/EncryptorShim";
import { Decryptor } from "./decryption/Decryptor";
import { DecryptorSubtle } from "./decryption/DecryptorSubtle";
import { DecryptorShim } from "./decryption/DecryptorShim";
import { ExternalKeyPair } from "./Interfaces";

/**
 * Only export the interfaces, not the concrete implementations.
 */
export { Encryptor, Decryptor };

/**
 * Export the decryptor implementation for Node.
 * 
 * @todo Make the Shim crypto check return three possible cases and move
 *       this to makeDecryptor()--also add Node implementation for Encryptor.
 */
export { DecryptorNode } from "./decryption/DecryptorNode";

/**
 * Imports a form public key and creates an encryptor.
 */
export function makeEncryptor(formPublic: string): PromiseLike<Encryptor> {
    return Shim.checkECDH().then(hasSubtle =>
        hasSubtle
            ? EncryptorSubtle.fromPublic(formPublic)
            : EncryptorShim.fromPublic(formPublic)
    );
}

/**
 * Imports a form private key and creates a decryptor.
 */
export function makeDecryptor(privateKey: string): PromiseLike<Decryptor> {
    return Shim.checkECDH().then(hasSubtle =>
        hasSubtle
            ? DecryptorSubtle.fromPrivate(privateKey)
            : DecryptorShim.fromPrivate(privateKey)
    );
}

/**
 * Generates an ECDH keypair.
 */
export function genKey(): PromiseLike<ExternalKeyPair> {
    return Shim.checkECDH().then(hasSubtle =>
        hasSubtle
            ? DecryptorSubtle.genKey()
            : DecryptorShim.genKey()
    );
}
import { Shim } from "./Shim";
import { Encryptor } from "./Encryptor";
import { EncryptorSubtle } from "./EncryptorSubtle";
import { EncryptorShim } from "./EncryptorShim";
import { Decryptor } from "./Decryptor";
import { DecryptorSubtle } from "./DecryptorSubtle";
import { DecryptorShim } from "./DecryptorShim";
import { ExternalKeyPair } from "./Interfaces";

/**
 * Exports for the browser library.
 */
export * from "./Encryptor";
export * from "./Decryptor";
export * from "./Interfaces";
export * from "./encoding/Base64";
export * from "./encoding/Hex";
export * from "./encoding/misc";

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

export function genKey(): PromiseLike<ExternalKeyPair> {
    return Shim.checkECDH().then(hasSubtle =>
        hasSubtle
            ? DecryptorSubtle.genKey()
            : DecryptorShim.genKey()
    );
}
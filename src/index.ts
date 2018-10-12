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

/**
 * Imports a form public key and creates an encryptor.
 */
export function makeEncryptor(formPublic: string): PromiseLike<Encryptor> {
    return Shim.checkECDH().then(hasECDH => {
        if (hasECDH)
            return EncryptorSubtle.fromPublic(formPublic);
        else
            return EncryptorShim.fromPublic(formPublic);
    });
}

/**
 * Imports a form private key and creates a decryptor.
 */
export function makeDecryptor(privateKey: string): PromiseLike<Decryptor> {
    return Shim.checkECDH().then(hasECDH => {
        return hasECDH ?
            DecryptorSubtle.fromPrivate(privateKey) :
            DecryptorShim.fromPrivate(privateKey);
    });
}

export function genKey(): PromiseLike<ExternalKeyPair> {
    return Shim.checkECDH().then(hasECDH => {
        return hasECDH ?
            DecryptorSubtle.genKey() :
            DecryptorShim.genKey();
    });
}
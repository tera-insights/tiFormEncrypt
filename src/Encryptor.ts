import { EncryptedData } from "./Interfaces";
import { Shim } from "./Shim";
import { EncryptorSubtle } from "./EncryptorSubtle";
import { EncryptorShim } from "./EncryptorShim";

export type SuccessCallback = (result: EncryptedData) => void;
export type FailureCallback = (reason: any) => void;

export abstract class Encryptor {

    /**
     * Imports a form public key and creates an encryptor.
     */
    static fromPublic(publicKey: string): PromiseLike<Encryptor> {
        return Shim.checkECDH().then(hasECDH => {
            if (hasECDH)
                return EncryptorSubtle.fromPublic(publicKey);
            else
                return EncryptorShim.fromPublic(publicKey);
        });
    }

    abstract encrypt(data: Uint8Array | string): PromiseLike<EncryptedData>;
    abstract encrypt(data: Uint8Array | string, onsuccess: SuccessCallback, onfailure: FailureCallback): void;

}
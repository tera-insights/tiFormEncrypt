import { EncryptedData } from "./Interfaces";

export type SuccessCallback = (result: EncryptedData) => void;
export type FailureCallback = (reason: any) => void;

export abstract class Encryptor {

    abstract encrypt(data: Uint8Array | string): PromiseLike<EncryptedData>;
    abstract encrypt(data: Uint8Array | string, onsuccess: SuccessCallback, onfailure: FailureCallback): void;

}
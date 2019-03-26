import { EncryptedData } from "./Interfaces";

export abstract class Encryptor {

    abstract encrypt(data: Uint8Array | string): PromiseLike<EncryptedData>;

}
/**
 * Main file for the browser library
 */
import { noECDH } from "./Fixes";
export { ready } from "./Fixes";

import { Encryptor } from '../src/Encryptor';
import { Decryptor, ExternalKeyPair } from '../src/Decryptor';
export { ExternalKeyPair } from '../src/Decryptor';

import { DecryptorShim } from '../src/DecryptorShim';
import { EncryptorShim } from '../src/EncryptorShim';


export function MakeEncryptor(formPublicKey: string): Encryptor | EncryptorShim {
    if (noECDH) {
        return new EncryptorShim(formPublicKey);
    } else {
        return new Encryptor(formPublicKey);
    }
}

export function MakeDecryptor(privKey: string): Decryptor | DecryptorShim {
    if (noECDH) {
        return new DecryptorShim(privKey);
    } else {
        return new Decryptor(privKey);
    }
}

export function GenerateKey(): any {
    if (noECDH){
        return DecryptorShim.generateKey();
    } else {
        return Decryptor.generateKey();
    }
}



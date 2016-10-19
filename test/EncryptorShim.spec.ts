/// <reference path="../typings/index.d.ts" />
/// <reference path="../src/Converters.ts" />

import { expect } from 'chai';
//import { Encryptor } from '../src/Encryptor';
import { ExternalKeyPair } from '../src/Decryptor';
import { DecryptorShim } from '../src/DecryptorShim';
import { EncryptorShim } from '../src/EncryptorShim';

// fixes for browsers that do not implement all needed functionality
import { noECDH } from '../src/Fixes';
// hack to force the fixes to be loaded
var a = noECDH;

// Need to generate a key before we can do any testing
describe('EncryptorShim', () => {
    describe('Build', () => {
        it('should be instantiated correctly', (done) => {
            DecryptorShim.generateKey()
                .then((keyPair: ExternalKeyPair) => {
                    var encryptor = new EncryptorShim(keyPair.pubKey);
                    encryptor.ready().then(() => {
                        expect(encryptor).to.have.property('encryptString');
                        expect(encryptor).to.have.property('importKey');
                        expect(encryptor).to.have.property('encryptString');
                        expect(encryptor).to.have.property('formKey');
                        done();
                    });
                }).catch((err) => { done(err) });
        });
        it('should encrypt without errors', (done) => {
            DecryptorShim.generateKey().then((keyPair: ExternalKeyPair) => {
                var encryptor = new EncryptorShim(keyPair.pubKey);
                encryptor.ready().then(() => {
                    encryptor.encryptString('tiForms').then((enc) => {
                        expect(enc).to.have.property('payload');
                        expect(enc).to.have.property('pubKey');
                        done();
                    })//.catch((err) => { done(err) });
                });
            }).catch((err) => { done(err) });
        });

        it('should encrypt and then decrypt', (done) => {
            DecryptorShim.generateKey().then((keyPair: ExternalKeyPair) => {
                var encryptor = new EncryptorShim(keyPair.pubKey);
                return encryptor.ready().then(() => {
                    return encryptor.encryptString('tiForms').then((enc) => {
                        var decryptor = new DecryptorShim(keyPair.privKey);
                        return decryptor.ready().then(() => {
                            return decryptor.decryptString(enc).then((data: string) => {
                                expect(data).to.be.equal('tiForms');
                                done();
                            });
                        });
                    });
                });
            }).catch((err) => { done(err) });
        });

        it('should encrypt and then decrypt using callbacks', (done) => {
            DecryptorShim.generateKey().then((keyPair: ExternalKeyPair) => {
                var encryptor = new EncryptorShim(keyPair.pubKey);
                return encryptor.ready(() => {
                    return encryptor.encryptString('tiForms').then((enc) => {
                        var decryptor = new DecryptorShim(keyPair.privKey);
                        return decryptor.ready(() => {
                            decryptor.decryptString(enc).then((data: string) => {
                                expect(data).to.be.equal('tiForms');
                                done();
                            });
                        });
                    });
                });
            }).catch((err) => { done(err) });
        });
    })
});

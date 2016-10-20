/// <reference path="../typings/index.d.ts" />

import { expect } from 'chai';
import { Encryptor } from '../src/Encryptor';
import { ExternalKeyPair } from '../src/Decryptor';
import { DecryptorShim } from '../src/DecryptorShim';
import { ensureECDH } from '../src/Fixes';

// Need to generate a key before we can do any testing
describe('Encryptor ShimToSubt', () => {
    ensureECDH.then( () => {
        describe('Build', () => {
            it('should be instantiated correctly', (done) => {
                DecryptorShim.generateKey().then((keyPair: ExternalKeyPair) => {
                    var encryptor = new Encryptor(keyPair.pubKey);
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
                    var encryptor = new Encryptor(keyPair.pubKey);
                    encryptor.ready().then(() => {
                        encryptor.encryptString('tiForms').then((enc) => {
                            expect(enc).to.have.property('payload');
                            expect(enc).to.have.property('pubKey');
                            done();
                        }, (err) => { done(err) });
                    });
                }).catch((err) => { done(err) });
            });

            it('should encrypt and then decrypt', (done) => {
                DecryptorShim.generateKey().then((keyPair: ExternalKeyPair) => {
                    var encryptor = new Encryptor(keyPair.pubKey);
                    return encryptor.ready().then(() => {
                        return encryptor.encryptString('tiForms').then((enc) => {
                            var decryptor = new DecryptorShim(keyPair.privKey);
                            return decryptor.ready().then(() => {
                                return decryptor.decryptString(enc).then((data: string) => {
                                    expect(data).to.be.equal('tiForms');
                                    done();
                                });
                            });
                        }, (err) => { done(err) });
                    });
                }).catch((err) => { done(err) });
            });

            it('should encrypt and then decrypt using callbacks', (done) => {
                DecryptorShim.generateKey().then((keyPair: ExternalKeyPair) => {
                    var encryptor = new Encryptor(keyPair.pubKey);
                    return encryptor.ready(() => {
                        encryptor.encryptString('tiForms').then((enc) => {
                            var decryptor = new DecryptorShim(keyPair.privKey);
                            return decryptor.ready(() => {
                                return decryptor.decryptString(enc).then((data: string) => {
                                    expect(data).to.be.equal('tiForms');
                                    done();
                                });
                            });
                        });
                    });
                }).catch((err) => { done(err) });
            });
        });
    });
});

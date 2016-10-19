/// <reference path="../typings/index.d.ts" />
/// <reference path="../src/Converters.ts" />

import { expect } from 'chai';
import { Encryptor } from '../src/Encryptor';
import { Decryptor, ExternalKeyPair } from '../src/Decryptor';
import { ensureECDH } from '../src/Fixes';

// Need to generate a key before we can do any testing
describe('Encryptor', () => {
   ensureECDH.then( () => {
    describe('Build', () => {
        it('should be instantiated correctly', (done) => {
            Decryptor.generateKey().then((keyPair: ExternalKeyPair) => {
                var encryptor = new Encryptor(keyPair.pubKey);
                encryptor.ready().then(() => {
                    expect(encryptor).to.have.property('encryptString');
                    expect(encryptor).to.have.property('importKey');
                    expect(encryptor).to.have.property('encryptString');
                    expect(encryptor).to.have.property('formKey');
                    done();
                });
            }, (err) => { done(err) });
        });

        it('should encrypt without errors', (done) => {
            Decryptor.generateKey().then((keyPair: ExternalKeyPair) => {
                var encryptor = new Encryptor(keyPair.pubKey);
                encryptor.ready().then(() => {
                    encryptor.encryptString('tiForms').then((enc) => {
                        expect(enc).to.have.property('payload');
                        expect(enc).to.have.property('pubKey');
                        done();
                    }, (err) => { done(err) });
                });
            }, (err) => { done(err) });
        });

        it('should encrypt and then decrypt', (done) => {
            Decryptor.generateKey().then((keyPair: ExternalKeyPair) => {
                var encryptor = new Encryptor(keyPair.pubKey);
                encryptor.ready().then(() => {
                    encryptor.encryptString('tiForms').then((enc) => {
                        var decryptor = new Decryptor(keyPair.privKey);
                        return decryptor.ready().then(() => {
                            decryptor.decryptString(enc).then((data: string) => {
                                expect(data).to.be.equal('tiForms');
                                done();
                            });
                        });
                    }, (err) => { done(err) });
                });
            }, (err) => { done(err) });
        });

        it('should encrypt and then decrypt using callbacks', (done) => {
            Decryptor.generateKey().then((keyPair: ExternalKeyPair) => {
                var encryptor = new Encryptor(keyPair.pubKey);
                encryptor.ready(() => {
                    encryptor.encryptString('tiForms').then((enc) => {
                        var decryptor = new Decryptor(keyPair.privKey);
                        return decryptor.ready(() => {
                            decryptor.decryptString(enc).then((data: string) => {
                                expect(data).to.be.equal('tiForms');
                                done();
                            });
                        });
                    }, (err) => { done(err) });
                });
            }, (err) => { done(err) });
        });
    });
   });
});

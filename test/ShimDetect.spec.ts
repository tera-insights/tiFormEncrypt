/// <reference path="../typings/index.d.ts" />

import { expect } from 'chai';
import * as tiForms from '../src/index';

describe('Shim', () => {
    for (var i = 0; i < 10; i++) {
        tiForms.ready().then(
            () => {
                describe('Build', () => {
                    it('should be instantiated correctly', (done) => {
                        tiForms.GenerateKey().then((keyPair: tiForms.ExternalKeyPair) => {
                            var encryptor = tiForms.MakeEncryptor(keyPair.pubKey);
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
                        tiForms.GenerateKey().then((keyPair: tiForms.ExternalKeyPair) => {
                            var encryptor = tiForms.MakeEncryptor(keyPair.pubKey);
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
                        tiForms.GenerateKey().then((keyPair: tiForms.ExternalKeyPair) => {
                            var encryptor = tiForms.MakeEncryptor(keyPair.pubKey);
                            encryptor.ready().then(() => {
                                encryptor.encryptString('tiForms').then((enc) => {
                                    var decryptor = tiForms.MakeDecryptor(keyPair.privKey);
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
                        tiForms.GenerateKey().then((keyPair: tiForms.ExternalKeyPair) => {
                            var encryptor = tiForms.MakeEncryptor(keyPair.pubKey);
                            encryptor.ready(() => {
                                encryptor.encryptString('tiForms').then((enc) => {
                                    var decryptor = tiForms.MakeDecryptor(keyPair.privKey);
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
            }
        );
    }
});

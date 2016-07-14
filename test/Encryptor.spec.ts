/// <reference path="../typings/index.d.ts" />
/// <reference path="../src/Converters.ts" />

import { expect } from 'chai';
import { Encryptor } from '../src/Encryptor';
import { Decryptor, ExternalKeyPair } from '../src/Decryptor';

// Need to generate a key before we can do any testing
describe('Encryptor', () => {
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
            }).catch((err) => { done(err) });
        });

        it('should encrypt without errors', (done) => {
            Decryptor.generateKey().then((keyPair: ExternalKeyPair) => {
                var encryptor = new Encryptor(keyPair.pubKey);
                encryptor.ready().then(() => {
                    encryptor.encryptString('tiForms').then((enc)=>{
                        expect(enc).to.have.property('payload');
                        expect(enc).to.have.property('pubKey');
                        done();
                    }).catch((err) => { done(err) });
                });
            }).catch((err) => { done(err) });
        });
    });
});

/// <reference path="../typings/index.d.ts" />
/// <reference path="../src/Converters.ts" />

import { expect } from 'chai';
import { Encryptor } from '../src/Encryptor';
import { Decryptor, ExternalKeyPair } from '../src/Decryptor';

Decryptor.generateKey().then((keyPair: ExternalKeyPair) => {
    // Need to generate a key before we can do any testing
    describe('Encryptor', () => {
        describe('Build', () => {
            var encryptor = new Encryptor(keyPair.pubKey); 
            console.log(encryptor);
            it('should be instantiated correctly', () => {
                expect(encryptor).to.have.property('encryptString');
                expect(encryptor).to.have.property('importKey');
                expect(encryptor).to.have.property('encryptString');
            });

        });

    });

}).catch( (err) => {
    console.error(err);
    describe('Decryptor', () => {
        it('should create key correctly', () => {
            // if this is executed, things are bad
            expect("A").to.be("B");
        });
    });
});

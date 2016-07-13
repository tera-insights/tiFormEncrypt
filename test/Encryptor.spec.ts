/// <reference path="../typings/index.d.ts" />
/// <reference path="../src/base64.ts" />

import { expect } from 'chai';
import { Encryptor } from '../src/Encryptor';

describe('Encryptor', () => {
    describe('Build', () => {

        it('should be instantiated correctly', () => {
            expect(new Encryptor("")).to.have.property('encryptString');
        });

    });

});
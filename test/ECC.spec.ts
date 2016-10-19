/// <reference path="../typings/index.d.ts" />
/// <reference path="../src/Converters.ts" />

import { expect } from 'chai';
import { PubECC, PrivECC } from '../src/ECC';

describe('ECC', () => {
    it('should encode private key correctly', () => {
        var privKey = new PrivECC();
        var ext = privKey.exportPrivate();
        expect((new PrivECC(ext)).exportPrivate()).to.be.equal(ext);
    });
    it('shoudl encode public key correctly', () => {
        var privKey = new PrivECC();
        var pubKey = privKey.exportPublic();
        expect( (new PubECC(pubKey)).export()).to.be.equal(pubKey);
    });
    it('should perform ECDH correctly', () => {
        // repeat this so we are sure
        for (var i=0; i<10; i++){
            var pr1 = new PrivECC();
            var pr2 = new PrivECC();
            var pu1 = new PubECC(pr1.exportPublic());
            var pu2 = new PubECC(pr2.exportPublic());
            expect(pr1.ECDH(pu2)).to.deep.equal(pr2.ECDH(pu1));
        }
    })
})
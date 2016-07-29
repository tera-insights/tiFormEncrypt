/// <reference path="../typings/index.d.ts" />
/// <reference path="../src/Converters.ts" />

import { expect } from 'chai';
import { Converters } from '../src/Converters';

const s1: string = btoa("tiForms");
const a2: Array<number> = [1,2,3,4,5]; 
const b2: Uint8Array = Uint8Array.from(a2);   

describe('base64', () => {
    describe('base64toUint8Array', () => {
        it('should work with empty string', () => {
            expect(Converters.base64ToUint8Array('')).eql(new Uint8Array(0));
        });
        it('should correctly encode basic example', () => {
            var s2 = Converters.Uint8ArrayToBase64(b2);
            expect(Converters.base64ToUint8Array(s2)).eql(b2);
        });
    });
    describe('Uint8ArraytoBase64', () => {
        it ('should work with empty array', () => {
            expect(Converters.Uint8ArrayToBase64(new Uint8Array(0))).to.be.equal('');
        });
        it('should correctly decode Uint8ArraytoBase64', () => {
            var b1 = Converters.base64ToUint8Array(s1);
            expect(Converters.Uint8ArrayToBase64(b1)).to.be.equal(s1);
        })
    });
    describe('stringToUint8Array', () => {
        it('should work with empty string', () => {
            expect(Converters.stringToUint8Array('')).eql(new Uint8Array(0));
        });
        it('should correctly encode basic example', () => {
            var s2 = Converters.Uint8ArrayToString(b2);
            expect(Converters.stringToUint8Array(s2)).eql(b2);
        });
    });
    describe('Uint8ArrayToString', () => {
        it ('should work with empty array', () => {
            expect(Converters.Uint8ArrayToString(new Uint8Array(0))).to.be.equal('');
        });
        it('should correctly decode Uint8ArrayToString', () => {
            var b1 = Converters.stringToUint8Array('tiForms');
            expect(Converters.Uint8ArrayToString(b1)).to.be.equal('tiForms');
        })
    });
    describe('base64ToBase64URL', () => {
        it ('should work with empty array', () => {
            expect(Converters.base64ToBase64URL('')).to.be.equal('');
            expect(Converters.base64URLToBase64('')).to.be.equal('');
        });
        it('should correctly decode', () => {
            var s1 = Converters.Uint8ArrayToBase64(Uint8Array.from([1,2,3,4]));
            var s2 = Converters.Uint8ArrayToBase64(b2);
            var s3 = Converters.Uint8ArrayToBase64(Uint8Array.from([252,200,31,43,51,68]));
            var s4 = Converters.Uint8ArrayToBase64(Uint8Array.from([1,2,3,4,5,6,7]));
            expect(Converters.base64URLToBase64(Converters.base64ToBase64URL(s1))).to.be.equal(s1);
            expect(Converters.base64URLToBase64(Converters.base64ToBase64URL(s2))).to.be.equal(s2);
            expect(Converters.base64URLToBase64(Converters.base64ToBase64URL(s3))).to.be.equal(s3);
            expect(Converters.base64URLToBase64(Converters.base64ToBase64URL(s4))).to.be.equal(s4);
        })
    });

});



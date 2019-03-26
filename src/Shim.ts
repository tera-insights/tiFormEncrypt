import * as ShimPromise from "promise-polyfill";

// Fix for Safari
if (window.crypto && !window.crypto.subtle && window.crypto["webkitSubtle"])
    (<any>window).crypto.subtle = window.crypto["webkitSubtle"];

// Fix for IE and Edge
if (!window.crypto && window["msCrypto"])
    (<any>window).crypto = window["msCrypto"];

/**
 * Shim provides feature detection so we can determine if we need to use shim classes
 * or not.
 */
export class Shim {

    static Promise: PromiseConstructor = Promise || ShimPromise;

    private static readonly detectionPromise = new Shim.Promise<boolean>(resolve => {
        try {
            window.crypto.subtle.generateKey({
                name: "ECDH",
                namedCurve: "P-256",
            }, true, ["deriveKey", "deriveBits"]).then(pair => {
                return crypto.subtle.exportKey("jwk", pair.privateKey).then(jwk => {
                    resolve(jwk.kty === "EC" && jwk.crv === "P-256" && !!jwk.x && !!jwk.y);
                });
            }).then(null, () => resolve(false));
        } catch {
            resolve(false);
        }
    });

    /**
     * Resolves with true if ECDH is supported and false otherwise. Never rejects.
     */
    static checkECDH(): PromiseLike<boolean> {
        return Shim.detectionPromise;
    }

}
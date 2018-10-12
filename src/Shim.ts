
/**
 * This file contains fixes for browsers that do not implement all the stuff we need.
 */

if (!Uint8Array.from) {
    Uint8Array.from = function (arg) { return new Uint8Array(arg); }
}

// Fix for Safari
if (window.crypto && !window.crypto.subtle && (<any>window).crypto.webkitSubtle) {
    (<any>window).crypto.subtle = (<any>window).crypto.webkitSubtle;
}

// Fix for IE and Edge
if (!window.crypto && (<any>window).msCrypto) {
    (<any>window).crypto = (<any>window).msCrypto;
}

export class Shim {

    private static readonly detectionPromise = new Promise<boolean>(resolve => {
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
    static checkECDH(): Promise<boolean> {
        return this.detectionPromise;
    }

}
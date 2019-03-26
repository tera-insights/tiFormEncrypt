import * as PromiseShim from "promise-polyfill";

function coerceNonstandardProperty(obj: {[prop: string]: any}, stdName: string, nonStdName: string): void {
    try {
        if (typeof obj === "object" && obj[stdName] === undefined && obj[nonStdName] !== undefined)
            obj[stdName] = obj[nonStdName];
    } catch (err) {
        console.error(`Failed to coerce property "${nonStdName}" to "${stdName}":`, err);
    }
}

// Fix for IE and Edge
coerceNonstandardProperty(window, "crypto", "msCrypto");

// Fix for Safari
coerceNonstandardProperty(window.crypto, "subtle", "webkitSubtle");

/**
 * Shim provides feature detection so we can determine if we need to use shim classes
 * or not.
 */
export class Shim {

    static Promise: PromiseConstructor = Promise || PromiseShim;

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
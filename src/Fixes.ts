import * as Promise from "promise";

/**
 * This file contains fixes for various OSs that do not implement all the stuff we need.
 */

export var noECDH = false;

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

/** Detect if  we are missing the ECDH functionality */

var ecdhResolve;
var ecdhReject;

export var ensureECDH = new Promise(function (resolve, reject) {
    ecdhResolve = resolve;
    ecdhReject = reject;
});

try {
    window.crypto.subtle.generateKey(
        {
            name: "ECDH",
            namedCurve: "P-256",
        },
        false,
        ["deriveKey", "deriveBits"]
    )
        .then(function (key) {
            console.log("crypto.subtle supports ECDH");
            ecdhResolve();
        }, function (err) {
            noECDH = true;
            console.log("no ECDH support in crypto.subtle. Using shim.");
            ecdhReject();
        });
} catch (e) {
    noECDH = true;
    console.log("no ECDH support in crypto.subtle. Using shim.");
    ecdhReject();
}
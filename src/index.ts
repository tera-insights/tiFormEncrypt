/**
 * Main file for the browser library
 */
export * from "./Converters";
export * from "./Decryptor";
export * from "./Encryptor";

// Fix for Safari
if (window.crypto && !window.crypto.subtle && (<any>window).crypto.webkitSubtle) {
    window.crypto.subtle = (<any>window).crypto.webkitSubtle;
}
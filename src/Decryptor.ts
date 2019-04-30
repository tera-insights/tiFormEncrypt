import { EncryptedData } from "./Interfaces";
import { base64ToBinary, binaryToString } from "./Converters";

/**
 * Decryptor simplifies decryption of messages. It is also responsible for key
 * generation.
 * 
 * The generated key has the private part represented in base64(pkcs8)
 * and the public part as the concatenation (with | as separator) of the x,y
 * coordinates of the P-256 points in the "jwk" representation.
 */
export abstract class Decryptor {

    protected abstract _decrypt(edata: Uint8Array, extPub: string): PromiseLike<Uint8Array>;

    decrypt(data: EncryptedData, out?: "binary"): PromiseLike<Uint8Array>;
    decrypt(data: EncryptedData, out: "string"): PromiseLike<string>;
    decrypt(data: Uint8Array, key: string, out?: "binary"): PromiseLike<Uint8Array>;
    decrypt(data: Uint8Array, key: string, out: "string"): PromiseLike<string>;
    decrypt(data: Uint8Array | EncryptedData, outOrKey = "binary", out: "binary" | "string" = "binary"): PromiseLike<Uint8Array | string> {
        let
            edata: Uint8Array,
            extPub: string,
            outEnc: "binary" | "string";

        if (data instanceof Uint8Array) {
            edata = data;
            extPub = outOrKey;
            outEnc = out;
        } else {
            edata = base64ToBinary(data.payload);
            extPub = data.pubKey;

            if (outOrKey === "binary" || outOrKey === "string")
                outEnc = outOrKey;
            else
                throw Error(`invalid output encoding (expected "string" or "binary", got "${outOrKey}")`);
        }

        return this._decrypt(edata, extPub).then(
            decrypted => outEnc === "binary"
                ? decrypted
                : binaryToString(decrypted)
        );
    }

}
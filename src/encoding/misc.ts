
export function binaryToString(data: Uint8Array): string {
    return String.fromCharCode(...data);
}

export function stringToBinary(data: string): Uint8Array {
    const binary = new Uint8Array(data.length);

    for (let i = 0; i < data.length; ++i)
        binary[i] = data.charCodeAt(i);

    return binary;
}

/**
 * Convert a JSON web key to the simple tiForms external key format:
 * 
 *      Public:  `base64URL(x)|base64URL(y)`
 *      Private: `base64URL(x)|base64URL(y)|base64URL(d)`
 * 
 * Must be an EC key on the P-256 curve.
 * 
 * @see http://self-issued.info/docs/draft-goland-json-web-token-00.html#base64urlnotes
 */
export function jwkToTiFormsKey(key: JsonWebKey, pubOnly = false): string {
    if (key.kty !== "EC" || key.crv !== "P-256" || !key.x || !key.y)
        throw new TypeError("invalid key type");

    const pubKey = `${key.x}|${key.y}`;

    return pubOnly || !key.d
        ? pubKey
        : key.d;
}


function makeJWKKey(x: string, y: string, d?: string): JsonWebKey {
    return {
        kty: "EC",
        crv: "P-256",
        key_ops: ["deriveKey"],
        x: x,
        y: y,
        d: d
    };
}

export function tiFormsPubKeyToJWK(publicKey: string): JsonWebKey {
    const pubKeyParts = publicKey.split("|")
    return makeJWKKey(pubKeyParts[0], pubKeyParts[1])
}

/**
 * Convert a tiForms external key representation to JSON web key format.
 * 
 * @see jwkToTiFormsKey
 */
export function tiFormsKeyToJWK(keyStr: string, publicKey: string): JsonWebKey {
    const pubKeyParts = publicKey.split("|")

    switch (pubKeyParts.length) {
        case 2:
            return makeJWKKey(pubKeyParts[0], pubKeyParts[1], keyStr)
        default:
            throw new TypeError("malformed tiForms key");
    }
}

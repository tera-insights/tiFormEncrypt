
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
        : pubKey + `|${key.d}`;
}

/**
 * Convert a tiForms external key representation to JSON web key format.
 * 
 * @see jwkToTiFormsKey
 */
export function tiFormsKeyToJWK(key: string): JsonWebKey {
    const keyParts = key.split("|");
    const jwk: Partial<JsonWebKey> = {
        kty: "EC",
        crv: "P-256",
        key_ops: ["deriveKey"]
    };

    switch (keyParts.length) {
        case 3:
            jwk.d = keyParts[2];
        case 2:
            jwk.x = keyParts[0];
            jwk.y = keyParts[1];
            return jwk;
        default:
            throw new TypeError("malformed tiForms key");
    }
}

export function stringToBinary(data: string): Uint8Array {
    return Uint8Array.from(Array.prototype.map.call(data, x => { return x.charCodeAt(0); }))
}

export function binaryToString(data: Uint8Array): string {
    return Array.prototype.map.call(data, x => {
        return String.fromCharCode(x);
    }).join('');
}

export function base64ToBinary(data: string): Uint8Array {
    return stringToBinary(atob(data));
}

export function binaryToBase64(data: Uint8Array): string {
    return btoa(binaryToString(data));
}

export function base64ToBase64URL(data: string): string {
    return data.split('=')[0].replace(/\+/g, '-').replace(/\//g, '_');
}

export function base64URLToBase64(data: string): string {
    var d = data.replace(/\-/g, '+').replace(/\_/g, '/');
    switch (d.length % 4) {
        case 0: break; // no padding
        case 2: d = d + "=="; break; // 2 char padding
        case 3: d = d + "="; break; // 1 char padding
    }
    return d;
}

/**
 * Convert from JSON web key to a simpler text format. Works for both
 * private and public keys.
 * 
 * Note 1: Only works correctly for P-256 
 * Note 2: The string representation of the key is base64_x|base64_y
 * Note 3: The Base64 encoding used by crypto.subtle is non standard
 * 
 * @see http://self-issued.info/docs/draft-goland-json-web-token-00.html#base64urlnotes
 */
export function jwkToString(key: JsonWebKey, pubOnly?: boolean): string {
    if (key.kty !== "EC" || key.crv !== "P-256" || !key.x || !key.y)
        throw new Error("Key type not supported");
    if (key.d && !pubOnly) // private key  
        return [key.x, key.y, key.d].join('|');
    else // public only
        return [key.x, key.y].join('|');
}

/**
 * Special rules apply.
 * @see jwkToString
 */
export function stringToJwk(key: string): JsonWebKey {
    var arr = key.split('|');
    if (arr.length < 2 || arr.length > 3)
        throw new Error("Wrong string key representation");
    var ret: any = {
        kty: "EC", crv: "P-256", x: arr[0], y: arr[1],
        key_ops: ['deriveKey']
    }
    if (arr[2]) { // private key
        ret.d = arr[2];
    }
    return ret;
}

export function hexToBinary(hex: string): Uint8Array {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return new Uint8Array(bytes);
}

export function binaryToHex(bytes: Uint8Array): string {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}
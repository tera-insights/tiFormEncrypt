import { ec as EC } from "elliptic";
import { Base64 } from "./encoding/Base64";

/**
 * README
 * 
 * We use indutny's elliptic library, which heavily relies on their
 * big number library, bn.js, under the hood. Both libraries have
 * shit typings and terrible API, plus a lot of hacky JS source code.
 * As a result, we have to use a few any's in here.
 * 
 * @see https://github.com/indutny/elliptic
 * @see https://github.com/indutny/bn.js
 */

/**
 * One-time context setup.
 */
const elliptic = new EC("p256");

function exportTiFormsPublic(pair: EC.KeyPair): string {
    const raw = new Uint8Array(pair.getPublic("raw"));
    const x = raw.subarray(1, 33);
    const y = raw.subarray(33, 65);
    return `${Base64.encode(x, true)}|${Base64.encode(y, true)}`;
}

export class ECPublic {

    private keyPair: EC.KeyPair;

    export(): string {
        return exportTiFormsPublic(this.keyPair);
    }

    getKey(): any {
        return this.keyPair.getPublic();
    }

    constructor(ext: string) {
        const
            keyParts = ext.split('|'),
            x = Base64.decode(keyParts[0]),
            y = Base64.decode(keyParts[1]);

        const raw = Buffer.alloc(65)
        raw[0] = 4;
        raw.set(x, 1);
        raw.set(y, 33);

        this.keyPair = elliptic.keyFromPublic(raw);
    }

}

export class ECPrivate {

    private keyPair: EC.KeyPair;

    ecdh(pubKey: ECPublic): Uint8Array {
        return this.keyPair
            .derive(pubKey.getKey())
            .toArrayLike(Uint8Array);
    }

    exportPublic(): string {
        return exportTiFormsPublic(this.keyPair);
    }

    exportPrivate(): string {
        const d: Uint8Array = (this.keyPair.getPrivate() as any).toArrayLike(Uint8Array);
        return this.exportPublic() + `|${Base64.encode(d, true)}`;
    }

    /**
     * Passing an external key will import it, otherwise a keypair will
     * be generated.
     */
    constructor(ext?: string) {
        if (ext) {
            const keyParts = ext.split("|");
            const d = Base64.decode(keyParts[2]);
            this.keyPair = elliptic.keyFromPrivate(Buffer.from(d));
        } else {
            // Generate our own key since we have a good PRNG
            const d = new Uint8Array(32);
            crypto.getRandomValues(d);
            this.keyPair = elliptic.keyFromPrivate(Buffer.from(d));
        }
    }

}
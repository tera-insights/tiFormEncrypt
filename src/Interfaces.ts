
/**
 * Interface to encapsulate key pairs encoded in external formats
 */
export interface ExternalKeyPair {
    pubKey:  string;
    privKey: string;
}

/**
 * External format for passing around encrypted data.
 */
export interface EncryptedData {
    /**
     * The P-256 public key used to encrypt the data, in the form "X|Y", where X and Y
     * are the Base64Url-encoded coordinates.
     */
    pubKey: string;

    /**
     * The result of the following process, encoded as standard Base64:
     * 
     *  1. Generate P-256 keypair
     *  2. Derive a 256-bit AES-CBC key via ECDH (generated private + given public)
     *  3. Encrypt data using the AES key and a 16-byte zeroed IV
     */
    payload: string;
}
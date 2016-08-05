export interface EncryptedData {
    pubKey: string; // The public EC P-256 key as a Base64
    payload: string; // The encrypted payload as AES-256 CBC with IV=0. Key is derived usin Diffie-Helman 
}

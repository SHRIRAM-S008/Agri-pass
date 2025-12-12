import { encode as cborEncode, decode as cborDecode } from 'cbor-x';
import pako from 'pako';
import { encode as b45Encode, decode as b45Decode } from 'base45';

/**
 * Encodes data into a PixelPass-compatible format.
 * Pipeline: JSON Data -> CBOR -> Zlib Compression -> Base45 Encoding
 */
export function encodePixelPass(data: any): string {
    try {
        // 1. Serialize to CBOR
        // cbor-x returns a Uint8Array (Buffer in node, but Uint8Array in browser usually)
        const cborData = cborEncode(data);

        // 2. Compress using Zlib (Deflate)
        const compressedData = pako.deflate(cborData);

        // 3. Encode to Base45
        // base45 expects a Buffer or Uint8Array. 
        // We need to ensure we pass a compatible type. pako.deflate returns Uint8Array.
        const base45Data = b45Encode(compressedData);

        return base45Data;
    } catch (error) {
        console.error('Error encoding PixelPass data:', error);
        throw new Error('Failed to encode data for QR');
    }
}

/**
 * Decodes PixelPass-compatible format back to original data.
 * Pipeline: Base45 Decoding -> Zlib Decompression -> CBOR Decoding -> JSON Data
 */
export function decodePixelPass(encodedString: string): any {
    try {
        // 1. Decode Base45
        const compressedData = b45Decode(encodedString);

        // 2. Decompress Zlib
        const cborData = pako.inflate(compressedData);

        // 3. Decode CBOR
        const data = cborDecode(cborData);

        return data;
    } catch (error) {
        console.error('Error decoding PixelPass data:', error);
        // If it fails, it might be a normal URL or raw JSON (backward compatibility)
        try {
            return JSON.parse(encodedString);
        } catch {
            return null;
        }
    }
}

/**
 * Calculates a SHA-256 hash of the input string using the Web Crypto API.
 * This is used for tamper detection.
 */
export async function calculateHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

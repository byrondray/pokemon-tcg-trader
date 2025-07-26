// src/lib/server/encryption.ts
import CryptoJS from 'crypto-js';
import { ENCRYPTION_KEY } from '$env/static/private';

export function encryptTCGPocketId(id: string): string {
    try {
        const encrypted = CryptoJS.AES.encrypt(id, ENCRYPTION_KEY).toString();
        return encrypted;
    } catch (error) {
        console.error('Error encrypting TCG Pocket ID:', error);
        throw new Error('Failed to encrypt TCG Pocket ID');
    }
}

export function decryptTCGPocketId(encryptedId: string): string {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedId, ENCRYPTION_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted;
    } catch (error) {
        console.error('Error decrypting TCG Pocket ID:', error);
        throw new Error('Failed to decrypt TCG Pocket ID');
    }
}

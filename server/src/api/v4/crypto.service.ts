import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {

    private readonly ENCRYPTION_KEY: string;
    private static readonly IV_LENGTH = 16; // For AES, this is always 16

    constructor(private configService: ConfigService) {
        this.ENCRYPTION_KEY = this.configService.get('ENCRYPTION_KEY');
        if (this.ENCRYPTION_KEY.length !== 32) {
            throw new Error('Encryption key should be 32 bytes long.');
        }
    }

    encrypt(text: string): string {
        let iv = crypto.randomBytes(CryptoService.IV_LENGTH);
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        console.log('Before Encryption', text)
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    decrypt(text: string): string {
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.ENCRYPTION_KEY), iv);

        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        console.log('Decrypted', decrypted.toString())

        return decrypted.toString();
    }
}
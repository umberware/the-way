import * as Crypto from 'crypto';
import { Service } from '../decorator/service.decorator';

// @Service()
export class CryptoService {
    private ivLength: number = 16;

    public cypher(data: string, algorithmn: string, privateKey: string): string {
        let randomBuffer = Crypto.randomBytes(this.ivLength);
        let cypher = Crypto.createCipheriv(algorithmn, Buffer.from(privateKey.substr(0, 32)), randomBuffer);
        let encrypted = cypher.update(data);
        encrypted = Buffer.concat([encrypted, cypher.final()])
        return randomBuffer.toString('hex') + ':' + encrypted.toString('hex');
    }
    public decypher(data: string, algorithmn: string, privateKey: string): string {
        let encrypted = data.split(':');
        let randomBuffer = Buffer.from(encrypted.shift(), 'hex');
        let encryptedText = Buffer.from(encrypted.join(':'), 'hex');
        let decypher = Crypto.createDecipheriv(algorithmn, Buffer.from(privateKey.substr(0, 32)), randomBuffer);
        let decrypted = decypher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decypher.final()])
        return decrypted.toString();
    }
    public hash(data: string, algorithmn: string): string {
        let hash = Crypto.createHash(algorithmn);
        return hash.update(data, 'utf8').digest('hex');
    }
    public randomHash(size: number): string {
        return Crypto.randomBytes(size).toString('hex');
    }
}
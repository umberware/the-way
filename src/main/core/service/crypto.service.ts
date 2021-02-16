import * as Crypto from 'crypto';
import { System } from '../decorator/system.decorator';
import { Service } from '../decorator/service.decorator';

@Service()
@System
export class CryptoService {
    public cipher(data: string, algorithmn: string, privateKey: string, type: 'hex'|'base64' = 'hex'): string {
        const cypher = Crypto.createCipheriv(algorithmn, privateKey, Buffer.from([]));
        const encrypted = Buffer.concat([cypher.update(data, 'utf8'), cypher.final()]);
        return encrypted.toString(type);
    }
    public cipherIv(data: string, algorithmn: string, privateKey: string, type: 'hex'|'base64' = 'hex', ivLength = 16): string {
        const randomBuffer = Crypto.randomBytes(ivLength);
        const cypher = Crypto.createCipheriv(algorithmn, Buffer.from(privateKey), randomBuffer);
        const encrypted = Buffer.concat([cypher.update(data), cypher.final()]);
        return randomBuffer.toString('hex') + ':' + encrypted.toString(type);
    }
    public decipher(data: string, algorithmn: string, privateKey: string, type: 'hex'|'base64' = 'hex'): string {
        const dataAsBuffer = Buffer.from(data,  type);
        const decypher = Crypto.createDecipheriv(algorithmn, privateKey, Buffer.from([]));
        const decrypted = Buffer.concat([decypher.update(dataAsBuffer), decypher.final()]);
        return decrypted.toString();
    }
    public decipherIv(data: string, algorithmn: string, privateKey: string, type: 'hex'|'base64' = 'hex'): string {
        const encrypted = data.split(':');
        const randomBuffer = Buffer.from(encrypted.shift() as string, type);
        const encryptedText = Buffer.from(encrypted.join(':'), type);
        const decypher = Crypto.createDecipheriv(algorithmn, Buffer.from(privateKey), randomBuffer);
        const decrypted = Buffer.concat([decypher.update(encryptedText), decypher.final()]);
        return decrypted.toString();
    }
    public cipherWithRsa(data: string, publicKey: string, type: 'hex'|'base64' = 'hex'): string {
        const buffer = Buffer.from(data);
        const encrypted = Crypto.publicEncrypt(publicKey, buffer);
        return encrypted.toString(type);
    }
    public decipherWithRsa(data: string, privateKey: string, type: 'hex'|'base64' = 'hex'): string {
        const buffer = Buffer.from(data, type);
        const decrypted = Crypto.privateDecrypt(privateKey, buffer);
        return decrypted.toString('utf8');
    }
    public hash(data: string, algorithmn: string, type: 'hex'|'base64' = 'hex'): string {
        const hash = Crypto.createHash(algorithmn);
        return hash.update(data, 'utf8').digest(type);
    }
    public randomHash(size: number, type: 'hex'|'base64' = 'hex'): string {
        return Crypto.randomBytes(size).toString(type);
    }
}

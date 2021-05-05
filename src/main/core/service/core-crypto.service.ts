import * as Crypto from 'crypto';
import { System } from '../decorator/system.decorator';
import { Service } from '../decorator/service.decorator';

/**
 *   CoreCryptoService
 *   This component can be used to encrypt/decrypt, generate a hash and generate a random hash.
 *   @since 1.0.0
 */
@Service()
@System
export class CoreCryptoService {
    /**
     *   @method cipherIv
     *   A method to cipher some data.
     *   You can pass an algorithm that Crypto(from node) accept to encrypt the data
     *   @since 1.0.0
     *   @param data Refers to the data that will be encrypted
     *   @param algorithm Is the algorithm that will be used to cipher the data (only Crypto algorithm)
     *   @param privateKey is a secret text that will be used in the algorithm
     *   @param type is the 'base' of the ciphered data
     *   @return the ciphered data
     */
    public cipher(data: string, algorithmn: string, privateKey: string, type: 'hex'|'base64' = 'hex'): string {
        const cypher = Crypto.createCipheriv(algorithmn, privateKey, Buffer.from([]));
        const encrypted = Buffer.concat([cypher.update(data, 'utf8'), cypher.final()]);
        return encrypted.toString(type);
    }
    /**
     *   @method cipherIv
     *   A method to cipher some data.
     *   You can pass an algorithm that Crypto(from node) accept to encrypt the data and pass the iv buffer size.
     *   @since 1.0.0
     *   @param data Refers to the data that will be encrypted
     *   @param algorithm Is the algorithm that will be used to cipher the data (only Crypto algorithm)
     *   @param privateKey is a secret text that will be used in the algorithm
     *   @param type is the 'base' of the ciphered data
     *   @param ivLength is the size of the buffer
     *   @return the ciphered data
     */
    public cipherIv(data: string, algorithmn: string, privateKey: string, type: 'hex'|'base64' = 'hex', ivLength = 16): string {
        const randomBuffer = Crypto.randomBytes(ivLength);
        const cypher = Crypto.createCipheriv(algorithmn, Buffer.from(privateKey), randomBuffer);
        const encrypted = Buffer.concat([cypher.update(data), cypher.final()]);
        return randomBuffer.toString('hex') + ':' + encrypted.toString(type);
    }
    /**
     *   @method cipherWithRsa
     *   This method will cipher a data using the RSA algorithm
     *   @since 1.0.0
     *   @param data refers to the data ciphered
     *   @param publicKey is the public key that will be used in the algorithm
     *   @param type is the 'base' of the ciphered data
     *   @return the ciphered data
     */
    public cipherWithRsa(data: string, publicKey: string, type: 'hex'|'base64' = 'hex'): string {
        const buffer = Buffer.from(data);
        const encrypted = Crypto.publicEncrypt(publicKey, buffer);
        return encrypted.toString(type);
    }
    /**
     *   @method decipher
     *   A method to decipher a ciphered data
     *   @since 1.0.0
     *   @param data refers to the data ciphered
     *   @param algorithm Is the algorithm used to cipher the data (must be the same)
     *   @param privateKey is a secret text that will be used in the algorithm
     *   @param type is the 'base' of the ciphered data
     *   @return the deciphered data
     */
    public decipher(data: string, algorithmn: string, privateKey: string, type: 'hex'|'base64' = 'hex'): string {
        const dataAsBuffer = Buffer.from(data,  type);
        const decypher = Crypto.createDecipheriv(algorithmn, privateKey, Buffer.from([]));
        const decrypted = Buffer.concat([decypher.update(dataAsBuffer), decypher.final()]);
        return decrypted.toString();
    }
    /**
     *   @method decipher
     *   A method to decipher a ciphered data. This method will work only when in the cipher process is used an IV buffer.
     *   @since 1.0.0
     *   @param data refers to the data ciphered
     *   @param algorithm Is the algorithm used to cipher the data (must be the same)
     *   @param privateKey is a secret text that will be used in the algorithm
     *   @param type is the 'base' of the ciphered data
     *   @return the deciphered data
     */
    public decipherIv(data: string, algorithmn: string, privateKey: string, type: 'hex'|'base64' = 'hex'): string {
        const encrypted = data.split(':');
        const randomBuffer = Buffer.from(encrypted.shift() as string, type);
        const encryptedText = Buffer.from(encrypted.join(':'), type);
        const decypher = Crypto.createDecipheriv(algorithmn, Buffer.from(privateKey), randomBuffer);
        const decrypted = Buffer.concat([decypher.update(encryptedText), decypher.final()]);
        return decrypted.toString();
    }
    /**
     *   @method decipherWithRsa
     *   This method will decipher a data ciphered with the RSA algorithm
     *   @since 1.0.0
     *   @param data refers to the data ciphered
     *   @param privateKey is the secret key that will be used in the algorithm to decipher
     *   @param type is the 'base' of the ciphered data
     *   @return the deciphered data
     */
    public decipherWithRsa(data: string, privateKey: string, type: 'hex'|'base64' = 'hex'): string {
        const buffer = Buffer.from(data, type);
        const decrypted = Crypto.privateDecrypt(privateKey, buffer);
        return decrypted.toString('utf8');
    }
    /**
     *   @method hash
     *   This method will generate a hash from the passed data and algorithm
     *   @since 1.0.0
     *   @param data will be used to generate the hash
     *   @param algorithm The algorithm that will be used to generate the hash
     *   @param type is the 'base' of the ciphered data
     *   @return the data hash
     */
    public hash(data: string, algorithmn: string, type: 'hex'|'base64' = 'hex'): string {
        const hash = Crypto.createHash(algorithmn);
        return hash.update(data, 'utf8').digest(type);
    }
    /**
     *   @method randomHash
     *   This method will generate a random values if N size
     *   @since 1.0.0
     *   @param size is the amount of random values to be generated
     *   @param type is the 'base' of the ciphered data
     *   @return the random values as string
     */
    public randomHash(size: number, type: 'hex'|'base64' = 'hex'): string {
        return Crypto.randomBytes(size).toString(type);
    }
}

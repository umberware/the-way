import { CORE, CryptoService } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';

const privateRSAKey = '-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgQC4GEgLgVycVGytveBsSd2ytUdRaV0pJS9MszQzIcXV5buUoFD7\npynQnFWQXZek3MdWCellKF2LSLyaPKLc/6VPJj+mfmYxGsOZ0S/mJ9a3XE0Y7c0Q\nL/EkGzCk8gux4YM3xXf5qvb99jMYxpvAkAWG/BrGGP86qlj58SpvN3EtCQIDAQAB\nAoGAEoAOLWnQnr01NriQJxG9P8pL4niOLiZYfIK9yi2orfgqQ6NgwAlqgFZVmu5s\n4Np3BcR1Of82d1rV6UISs9bVC9V1cRmx8kM6YRxKs7o1KNFCipSWMYfSJkGXE+ko\nQ7fdRztYoHreKjgUcN5xWuTB8/qEtIQBb4u/VNGtcbp2jYkCQQDopHP5L9508mUQ\nH81YdjiOu0/H/3Ec1BxbZgqhw2piuzYHuvBjcKTrrZ+92GbGi4zq5vV8xwnZx3+y\nLjApNMlnAkEAypQGAi2x/WfumyH5/UmFoLzwIS+5vTjvqOJBXoCHjGzGPssdM11p\n+qL6NHHTmi1fp+o7ZfVZ5L8qwYBttB+gDwJAL1uS1C4fbdUOJ6shpRljyAJvajog\nr4qqPxzVmzpphLGxfP9cAhIjMGrGsuHDgjVUOVlMrdrisXeAEih+21SIjwJAJFXW\nmg9uLIC22JaIi3jjgghBngI8c4dB3W3vwa6WIYblLCAsdakcuDsBW+TKyo226Zxm\n2Qvf+tqbJagOhU9i2wJBAN93z5EWr5JJVsdn49BtpJPNcK+tS87rbrBdh5++5P8j\nH1MU/hA5j1fKuPsJd74R5ZtfDxzaqTfiD03mkxYqwT4=\n-----END RSA PRIVATE KEY-----';
const publicRSAKey = '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4GEgLgVycVGytveBsSd2ytUdR\naV0pJS9MszQzIcXV5buUoFD7pynQnFWQXZek3MdWCellKF2LSLyaPKLc/6VPJj+m\nfmYxGsOZ0S/mJ9a3XE0Y7c0QL/EkGzCk8gux4YM3xXf5qvb99jMYxpvAkAWG/BrG\nGP86qlj58SpvN3EtCQIDAQAB\n-----END PUBLIC KEY-----';
const ivKey = 'A2345678901234567890123456789012';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeAll(() => {
    EnvironmentTest.spyProcessExit();
});
describe('CryptoService: ', () => {
    let cryptoService: CryptoService;
    beforeAll(done => {
        process.argv.push('--the-way.core.scan.enabled=false');
        import('../../resources/environment/main/main.test').then(
            () => {
                CORE.whenReady().subscribe(
                    () => {
                        cryptoService = CORE.getInstanceByName<CryptoService>('CryptoService') as CryptoService;
                        done();
                    }
                );
            }
        );
    })
    test('Cipher and Decipher test', () => {
        const toCipher = 'Luck, I\'m your father!!';
        const key = '12345678901234567890123456789012'
        const ciphered = cryptoService.cipher(toCipher, 'aes-256-ecb', key);
        expect(ciphered).not.toBe(toCipher);
        const deciphered = cryptoService.decipher(ciphered, 'aes-256-ecb', key)
        expect(deciphered).toBe(toCipher);
    });
    test('CipherRsa and DecipherRsa test', () => {
        const toCipher = 'Hi, I\'m goku.';
        const ciphered = cryptoService.cipherWithRsa(toCipher, publicRSAKey);
        expect(ciphered).not.toBe(toCipher);
        const deciphered = cryptoService.decipherWithRsa(ciphered, privateRSAKey)
        expect(deciphered).toBe(toCipher);
    });
    test('CipherIv and DecipherIv test', () => {
        const toCipher = 'Hi, I\'m goku.';
        const ciphered = cryptoService.cipherIv(toCipher, 'aes-256-cbc', ivKey);
        expect(ciphered).not.toBe(toCipher);
        const deciphered = cryptoService.decipherIv(ciphered, 'aes-256-cbc', ivKey);
        expect(deciphered).toBe(toCipher);
    });
    test('Hash', () => {
        const toHash = 'Hi, I\'m goku.';
        const hashed = cryptoService.hash(toHash, 'sha256');
        expect(toHash).not.toBe(hashed)
    });
    test('Random Hash', () => {
        const hash = cryptoService.randomHash(185);
        expect(hash).toBeDefined();
    });
});

import * as forge from 'node-forge';
import {
  aesDecrypt,
  aesEncrypt,
  generateIv,
  generateSalt,
  pbkdf2,
  sha,
  generateKeyPair,
  prvKeyFromPem,
  prvKeyToPem,
  pubKeyFromPem,
  pubKeyToPem,
  rsaDecrypt,
  rsaEncrypt,
} from '../src/functions/crypto';

describe('generateSalt', () => {
  it('should return 128 bytes', async () => {
    const salt = generateSalt();
    const buffer = forge.util.createBuffer(salt);
    expect(buffer.length()).toBe(128);
  });

  it('should return 190 bytes', async () => {
    const salt = generateSalt(190);
    const buffer = forge.util.createBuffer(salt);
    expect(buffer.length()).toBe(190);
  });

  it('should throw error cuz bytes less or equal 0', async () => {
    expect(() => generateSalt(0)).toThrow('Bytes must be number more than 0');
    expect(() => generateSalt(-2)).toThrow('Bytes must be number more than 0');
  });
});

describe('pbkdf2', () => {
  it('should return 64 bytes key', async () => {
    const salt = generateSalt();
    const key = pbkdf2('password', salt, 100, 64);
    expect(key.length).toBe(64);
  });

  it('should return equal key for equal password and salt', async () => {
    const salt = generateSalt();
    const key1 = pbkdf2('password', salt, 100, 64);
    const key2 = pbkdf2('password', salt, 100, 64);
    expect(key1 === key2).toBe(true);
  });

  it('should return different key for equal password but different salt', async () => {
    const salt1 = generateSalt();
    const salt2 = generateSalt();
    const key1 = pbkdf2('password', salt1, 100, 64);
    const key2 = pbkdf2('password', salt2, 100, 64);
    expect(key1 === key2).toBe(false);
  });

  it('should return different key for equal salt but different password', async () => {
    const salt = generateSalt();
    const key1 = pbkdf2('password1', salt, 100, 64);
    const key2 = pbkdf2('password2', salt, 100, 64);
    expect(key1 === key2).toBe(false);
  });
});

describe('sha', () => {
  it('should return equal result for equal values', async () => {
    const result1 = sha('value', 'sha256');
    const result2 = sha('value', 'sha256');

    const result3 = sha('value', 'sha1');
    const result4 = sha('value', 'sha1');

    expect(result1 === result2).toBe(true);
    expect(result3 === result4).toBe(true);
  });

  it('should return 32 bytes key', async () => {
    const key = sha('value', 'sha256');
    expect(key.length).toBe(32);
  });

  it('should return 20 bytes key', async () => {
    const key = sha('value', 'sha1');
    expect(key.length).toBe(20);
  });
});

describe('generateIv', () => {
  it('should return random 16 bytes', async () => {
    const iv = generateIv();
    expect(iv.length).toBe(16);
  });
});

describe('aes', () => {
  it('should return encrypted data', async () => {
    const key = sha('key');
    const iv = generateIv();
    const encryptedData = aesEncrypt(key, iv, 'data');
    expect(encryptedData.length).toBeGreaterThan(0);
  });

  it('should return decrypted data', async () => {
    const key = sha('key');
    const iv = generateIv();
    const decryptedData = aesDecrypt(key, iv, 'R)Z<ÒEmln');
    expect(decryptedData.length).toBeGreaterThan(0);
  });

  it('should encrypt and decrypt data', async () => {
    const key = sha('key');
    const iv = generateIv();
    const data = 'secretData';

    const encryptedData = aesEncrypt(key, iv, data);
    const decryptedData = aesDecrypt(key, iv, encryptedData);
    expect(decryptedData).toBe(data);
  });
});

describe('rsa', () => {
  it('should get pem from public key', async () => {
    const keys = generateKeyPair();
    const pem = pubKeyToPem(keys.publicKey)
    expect(pem.length).toBeGreaterThan(400);
  });

  it('should get pem from private key', async () => {
    const keys = generateKeyPair();
    const pem = prvKeyToPem(keys.privateKey)
    expect(pem.length).toBeGreaterThan(1600);
  });

  it('should get public key from pem', async () => {
    const keys = generateKeyPair();
    const pem = pubKeyToPem(keys.publicKey)
    const pubKey = pubKeyFromPem(pem)

    const key1 = JSON.stringify(keys.publicKey)
    const key2 = JSON.stringify(pubKey)
    expect(key1).toBe(key2);
  });

  it('should get private key from pem', async () => {
    const keys = generateKeyPair();
    const pem = prvKeyToPem(keys.privateKey)
    const prvKey = prvKeyFromPem(pem)

    const key1 = JSON.stringify(keys.privateKey)
    const key2 = JSON.stringify(prvKey)
    expect(key1).toBe(key2);
  });

  it('should encrypt and decrypt data', async () => {
    const keys = generateKeyPair();
    const data = 'secret data';
    const encrypted = rsaEncrypt(data, keys.publicKey)
    const decrypted = rsaDecrypt(encrypted, keys.privateKey)

    expect(decrypted).toBe(data);
  });
});

import * as forge from 'node-forge';
import { toHex } from './utils';

export const generateSalt = (bytes = 128): string => {
  if (bytes <= 0) {
    throw 'Bytes must be number more than 0';
  }
  return toHex(forge.random.getBytesSync(bytes));
};

export const pbkdf2 = (password: string, salt: string, iterations: number, size: number) => {
  return toHex(forge.pkcs5.pbkdf2(password, salt, iterations, size));
};

export const sha = (value: string, alg: 'sha256' | 'sha1' = 'sha256') => {
  const algorithm = alg === 'sha256' ? forge.md.sha256 : forge.md.sha1;
  const md = algorithm.create();
  md.update(value);
  return md.digest().bytes();
};

export const aesEncrypt = (key: string, data: string): string => {
  const iv = forge.random.getBytesSync(16);
  const cipher = forge.cipher.createCipher('AES-CBC', key);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(data));
  cipher.finish();
  return iv + cipher.output.bytes();
};

export const aesDecrypt = (key: string, data: string): string => {
  const bytes = forge.util.createBuffer(data).bytes();
  const iv = bytes.substr(0, 16);
  const encryptedBytes = bytes.substr(16);
  const decipher = forge.cipher.createDecipher('AES-CBC', key);
  decipher.start({ iv });

  const dataLength = encryptedBytes.length;
  const chunkSize = 1024 * 64;
  let index = 0;
  let decrypted = '';
  do {
    decrypted += decipher.output.getBytes();
    const buf = forge.util.createBuffer(encryptedBytes.substr(index, chunkSize));
    decipher.update(buf);
    index += chunkSize;
  } while (index < dataLength);
  decipher.finish();
  decrypted += decipher.output.getBytes();
  return forge.util.createBuffer(decrypted, 'utf8').bytes();
};

export const generateKeyPair = () => {
  return forge.pki.rsa.generateKeyPair(2048);
};

export type PublicKey = forge.pki.rsa.PublicKey;
export type PrivateKey = forge.pki.rsa.PrivateKey;

export const pubKeyToPem = (key: PublicKey) => {
  return forge.pki.publicKeyToPem(key);
};

export const prvKeyToPem = (key: PrivateKey) => {
  return forge.pki.privateKeyToPem(key);
};

export const pubKeyFromPem = (key: string): PublicKey => {
  return forge.pki.publicKeyFromPem(key);
};

export const prvKeyFromPem = (key: string): PrivateKey => {
  return forge.pki.privateKeyFromPem(key);
};

export const rsaEncrypt = (value: string, key: PublicKey) => {
  const encrypted = key.encrypt(value);
  return forge.util.encode64(encrypted);
};

export const rsaDecrypt = (value: string, key: PrivateKey) => {
  const encrypted = forge.util.decode64(value);
  return key.decrypt(encrypted);
};

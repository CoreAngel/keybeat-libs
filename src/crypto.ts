import * as forge from 'node-forge';
import * as bc from 'bcrypt';

export const generateSalt = (bytes = 128): string => {
  if (bytes <= 0) {
    throw 'Bytes must be number more than 0';
  }
  return forge.random.getBytesSync(bytes);
};

export const pbkdf2 = (password: string, salt: string, iterations: number, size: number) => {
  return forge.pkcs5.pbkdf2(password, salt, iterations, size);
};

export const sha = (value: string, alg: 'sha256' | 'sha512' = 'sha256') => {
  const algorithm = alg === 'sha256' ? forge.md.sha256 : forge.md.sha512;
  const md = algorithm.create();
  md.update(value);
  return md.digest().bytes();
};

export const generateIv = (): string => {
  return forge.random.getBytesSync(16);
};

export const aesEncrypt = (key: string, iv: string, data: string): string => {
  const cipher = forge.cipher.createCipher('AES-CBC', key);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(data));
  cipher.finish();
  return cipher.output.bytes();
};

export const aesDecrypt = (key: string, iv: string, data: string): string => {
  const encryptedBytes = forge.util.createBuffer(data).bytes();
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

export const bcrypt = (password: string, rounds: number) => {
  return bc.hashSync(password, rounds);
};

export const bcryptCompare = (password: string, hash: string) => {
  return bc.compareSync(password, hash);
};

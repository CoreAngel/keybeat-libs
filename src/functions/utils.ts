import { random, util } from 'node-forge';
import * as qrcode from 'qrcode';

export const randomBytes = (length = 16): string => {
  if (length <= 0) {
    throw 'Length must be number more than 0';
  }
  return random.getBytes(length);
};

export const randomHexString = (length = 16): string => {
  const bytes = randomBytes(length);
  const buffer = util.createBuffer(bytes, 'raw');
  return buffer.toHex().substr(0, length);
};

export const generateQrDataUrl = async (uri: string): Promise<string> => {
  if (uri.length === 0) {
    throw 'Uri cannot be empty';
  }
  return qrcode.toDataURL(uri);
};

export const toHex = (data: string): string => {
  return util.bytesToHex(data);
};

export const fromHex = (data: string): string => {
  return util.hexToBytes(data);
};

export const toBase64 = (data: string) => {
  return util.encode64(data);
};

export const fromBase64 = (data: string) => {
  return util.decode64(data);
};

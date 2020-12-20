import { random, util } from 'node-forge';
import * as qrcode from 'qrcode';

export const randomHexString = (length = 16): string => {
  if (length <= 0) {
    throw 'Length must be number more than 0';
  }
  const bytes = random.getBytes(length);
  const buffer = util.createBuffer(bytes, 'raw');
  return buffer.toHex().substr(0, length);
};

export const generateQrDataUrl = async (uri: string): Promise<string> => {
  if (uri.length === 0) {
    throw 'Uri cannot be empty';
  }
  return await qrcode.toDataURL(uri);
};

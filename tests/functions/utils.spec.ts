import { randomHexString, generateQrDataUrl, toBase64, fromBase64 } from '../../src/functions/utils';

describe('randomHexString', () => {
  it('should return 16 length random string', async () => {
    const randomString = randomHexString();
    expect(randomString.length).toBe(16);
  });

  it('should return 32 length random string', async () => {
    const randomString = randomHexString(32);
    expect(randomString.length).toBe(32);
  });

  it('should throw error cuz length less or equal 0', async () => {
    expect(() => randomHexString(0)).toThrowError('Length must be number more than 0');
    expect(() => randomHexString(-2)).toThrowError('Length must be number more than 0');
  });
});

describe('generateQrDataUrl', () => {
  it('should generate valid data url', async () => {
    const uri = 'otpauth://totp/service:login?secret=secretKey&period=30&digits=6&algorithm=SHA1&issuer=service';
    const dataUrl =
      'data:image/png;base64,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' +
      'rQAAAAASUVORK5CYII=';
    const result = await generateQrDataUrl(uri);
    expect(result).toBe(dataUrl);
  });

  it('should throw error cuz empty uri', async () => {
    await expect(generateQrDataUrl('')).rejects.toEqual('Uri cannot be empty');
  });

  it('should encode and decode base64', async () => {
    const data = 'data to encode'
    const encoded = toBase64(data)
    const decoded = fromBase64(encoded)
    await expect(decoded).toBe(data);
  });
});

import crypto from 'crypto'

export const randomString = (length: number = 16): string => {
  if (length <= 0) {
    throw 'Length must be number more than 0'
  }
  return crypto.randomBytes(length).toString('hex');
}

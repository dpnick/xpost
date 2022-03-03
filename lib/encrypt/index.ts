import CryptoJs from 'crypto-js';

export function encrypt(data: string, key: string) {
  return CryptoJs.AES.encrypt(data, key).toString();
}

export function decrypt(cipher: string, key: string) {
  const bytes = CryptoJs.AES.decrypt(cipher, key);
  return bytes.toString(CryptoJs.enc.Utf8);
}

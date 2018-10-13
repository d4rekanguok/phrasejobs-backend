import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const key = (function ():string {
  if (typeof process.env.ENCRYPTION_KEY === 'undefined') throw 'No key';
  return process.env.ENCRYPTION_KEY;
})();

function encrypt (content: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, new Buffer(key), iv);
  const encrypted = Buffer.concat([ cipher.update(content), cipher.final() ]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(content: string) {
  const [ ivString, encryptedString ] = content.split(':');
  const iv = new Buffer(ivString, 'hex');
  const encrypted = new Buffer(encryptedString, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, new Buffer(key), iv);
  const decrypted = Buffer.concat([ decipher.update(encrypted), decipher.final() ]);

  return decrypted.toString();
}

export {
  encrypt,
  decrypt
}
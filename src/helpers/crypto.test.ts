import dotenv from 'dotenv';
dotenv.config();

import { encrypt, decrypt } from './crypto';
import { expect } from 'chai';

describe('encrypt & decrypt', () => {
  it('should return different encrypted strings from the same input', () => {
    const content = '9893toiujdp8k1uqj92ryfe8o713y2';
    const encrypted1 = encrypt(content);
    const encrypted2 = encrypt(content);
    expect(encrypted1).to.not.equal(encrypted2);
  });

  it('should return the same string', () => {
    const content = 'hello, this is very secret 12313121331';
    const encrypted = encrypt(content);
    const decrypted = decrypt(encrypted);
    expect(decrypted).to.equal(content);
  });
});
import assert from 'node:assert';
import { describe, it } from 'node:test';

import IdGenerator from '../src/IdGenerator.js';

import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

/**
 * @typedef {import('../src/IdGenerator.js').IdGeneratorParams} IdGeneratorParams
 */

/** @param {IdGeneratorParams} params */
function createIdGenerator({
  Crypto,
  Buffer,
  dictionary,
  randomPoolSize
} = {}) {
  return new IdGenerator({
    Crypto,
    Buffer,
    dictionary,
    randomPoolSize
  });
}

const Crypto = /** @type {Crypto} */ (crypto);

describe('IdGenerator', async () => {
  it('create unsafe', () => {
    const idGenerator = createIdGenerator();

    const id = idGenerator.create();

    assert.ok(id.length === 22);
  });

  it('create safe', () => {
    const idGenerator = createIdGenerator({
      Crypto,
      Buffer
    });

    const id = idGenerator.create();

    assert.ok(id.length === 22);
  });

  it('Only Crypto argument error', () => {
    assert.throws(() => createIdGenerator({
      Crypto,
      // Buffer
    }));
  });

  it('Only Buffer argument error', () => {
    assert.throws(() => createIdGenerator({
      Buffer
    }));
  });
});

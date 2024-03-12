import assert from 'node:assert';
import { describe, it } from 'node:test';

import IdGenerator from '../src/IdGenerator.js';

import crypto from 'node:crypto';

/**
 * @typedef {import('../src/IIdGenerator.js').IdGeneratorParams} IdGeneratorParams
 */

/** @param {IdGeneratorParams} params */
function createIdGenerator({
  crypto,

  dictionary,
  randomPoolSize
} = {}) {
  return new IdGenerator({
    crypto,

    dictionary,
    randomPoolSize
  });
}

describe('IdGenerator', () => {
  describe('unsafe', () => {
    it('create', () => {
      const idGenerator = createIdGenerator();

      const id = idGenerator.create();

      assert.ok(id.length === 22);
    });

    it('createArray', () => {
      const idGenerator = createIdGenerator();

      const idArray = idGenerator.createArray();

      assert.ok(idArray.length === 22);
    });
  });

  describe('safe', () => {
    it('create', () => {
      const idGenerator = createIdGenerator({
        crypto: /** @type {Crypto} */ (crypto)
      });

      const id = idGenerator.create();

      assert.ok(id.length === 22);
    });

    it('createArray', () => {
      const idGenerator = createIdGenerator({
        crypto: /** @type {Crypto} */ (crypto)
      });

      const idArray = idGenerator.createArray();

      assert.ok(idArray.length === 22);
    });
  });
});

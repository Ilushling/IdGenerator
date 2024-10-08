/**
 * @import {
 *  IIdGenerator,
 *  Dictionary
 * } from './IIdGenerator.js'
 */

/**
 * @implements {IIdGenerator}
 */
export default class IdGenerator {
  /**
   * @typedef {IdGeneratorDependencies
   *  & Partial<IdGeneratorConfigs>} IdGeneratorParams
   * @typedef {IdGeneratorDependencies
   *  & IdGeneratorConfigs
   *  & IdGeneratorStates} IdGeneratorProperties
   * 
   * @typedef {object} IdGeneratorDependencies
   * @property {Crypto=} crypto
   * 
   * @typedef {object} IdGeneratorConfigs
   * @property {Dictionary} dictionary Array of chars is faster than string
   *  - String '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'
   *  - Array of string ['-','0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','_','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
   *  - Array of char codes [45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 95, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 95, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122]
   * @property {number} randomPoolSize Max 65536
   * 
   * @typedef {object} IdGeneratorStates
   * @property {number} dictionarySize
   * @property {number} randomPoolOffset
   * @property {RandomPool} randomPool
   * @property {Buffer=} buffer
   * @property {number[]} randomInts
   * @property {string[] | number[]} chars
   */

  /**
   * @typedef {number[]} RandomPool
   */

  // Dependencies
  /** @type {IdGeneratorProperties['crypto']} */
  #crypto;

  // Configs
  /** @type {IdGeneratorProperties['dictionary']} */
  #dictionary;

  /** @type {IdGeneratorProperties['randomPoolSize']} */
  #randomPoolSize;

  // States
  /** @type {IdGeneratorProperties['dictionarySize']} */
  #dictionarySize;

  /** @type {IdGeneratorProperties['randomPoolOffset']} */
  #randomPoolOffset;

  /** @type {IdGeneratorProperties['randomPool']} */
  #randomPool;

  /** @type {IdGeneratorProperties['buffer']} */
  #buffer;

  /** @type {IdGeneratorProperties['randomInts']} */
  #randomInts;

  /** @type {IdGeneratorProperties['chars']} */
  #chars;

  /** @param {IdGeneratorParams} params */
  constructor(params) {
    // Dependencies
    this.#crypto = params.crypto;

    // Configs
    // dictionary = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz',
    // dictionary = [45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 95, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 95, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 95, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 95, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122],
    const dictionary = params.dictionary ?? ['-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    this.#dictionary = dictionary;
    if (typeof dictionary !== 'string' && !Array.isArray(dictionary)) {
      throw Object.assign(new Error('dictionary must be string or array of chars'), {
        name: 'InvalidDictionaryTypeError'
      });
    }

    this.#dictionarySize = dictionary.length;

    if (this.#dictionarySize < 1) {
      throw Object.assign(new Error('dictionary must be non-empty string'), {
        name: 'InvalidDictionaryLengthError'
      });
    }

    // States
    this.#randomPoolOffset = 0;
    const randomPoolSize = params.randomPoolSize ?? 128;
    this.#randomPoolSize = randomPoolSize;

    if (randomPoolSize < 1) {
      throw Object.assign(new Error('randomPoolSize must be greater than 0'), {
        name: 'InvalidRandomPoolSizeError'
      });
    }

    this.#randomPool = this.#createRandomPool(randomPoolSize);

    this.#randomInts = [];
    // 22 default create size
    this.#randomInts.length = 22;

    this.#chars = [];
    // 22 default create size
    this.#chars.length = 22;
  }

  //#region Interfaces
  /**
   * Create random string of dictionary chars
   * @param {number=} size
   */
  create(size = 22) {
    return this.createArray(size).join('');
  }

  /**
   * Create random array of dictionary chars
   * @param {number=} size
   */
  createArray(size = 22) {
    if (size < 1) {
      return [];
    }

    const dictionary = this.#dictionary;

    const chars = this.#chars;

    if (chars.length !== size) {
      chars.length = size;
    }

    const randomInts = this.#getRandomInts(size);

    const threads = 4;
    if (size < threads) {
      for (let i = 0; i < size; i++) {
        const position = randomInts[i];

        const char = dictionary[position];

        chars[i] = char;
      }
    } else {
      const sizeRemaining = size % threads;

      if (sizeRemaining === 0) {
        for (let i = 0; i < size; i += threads) {
          const i2 = i + 1;
          const i3 = i + 2;
          const i4 = i + 3;

          const random1 = randomInts[i];
          const random2 = randomInts[i2];
          const random3 = randomInts[i3];
          const random4 = randomInts[i4];

          const char1 = dictionary[random1];
          const char2 = dictionary[random2];
          const char3 = dictionary[random3];
          const char4 = dictionary[random4];

          chars[i] = char1;
          chars[i2] = char2;
          chars[i3] = char3;
          chars[i4] = char4;
        }
      } else {
        const length = size - sizeRemaining;

        for (let i = 0; i < length; i += threads) {
          const i2 = i + 1;
          const i3 = i + 2;
          const i4 = i + 3;

          const random1 = randomInts[i];
          const random2 = randomInts[i2];
          const random3 = randomInts[i3];
          const random4 = randomInts[i4];

          const char1 = dictionary[random1];
          const char2 = dictionary[random2];
          const char3 = dictionary[random3];
          const char4 = dictionary[random4];

          chars[i] = char1;
          chars[i2] = char2;
          chars[i3] = char3;
          chars[i4] = char4;
        }

        for (let i = length; i < size; i++) {
          const position = randomInts[i];

          const char = dictionary[position];

          chars[i] = char;
        }
      }
    }

    return chars;
  }
  //#endregion

  //#region Logic
  /**
   * @param {number} size
   */
  #createRandomPool(size) {
    /** @type {number[]} */
    const randomPool = [];
    randomPool.length = size;

    if (Buffer != null) {
      this.#buffer = Buffer.alloc(size);
    }

    this.#randomPoolSize = size;
    this.#updateRandomPool(randomPool);

    return randomPool;
  }

  #resetRandomPoolOffset() {
    this.#randomPoolOffset = 0;
  }

  /**
   * @param {RandomPool} randomPool
   */
  #updateRandomPool(randomPool) {
    const crypto = this.#crypto;

    const randomPoolSize = this.#randomPoolSize;
    const dictionarySize = this.#dictionarySize;

    const threads = 4;
    const sizeRemaining = randomPoolSize % threads;

    if (crypto != null) {
      const buffer = this.#buffer;
      if (buffer != null) {
        crypto?.getRandomValues(buffer);

        if (dictionarySize === 256) {
          if (sizeRemaining === 0) {
            for (let i = 0; i < randomPoolSize; i += threads) {
              const i2 = i + 1;
              const i3 = i + 2;
              const i4 = i + 3;

              const position1 = buffer[i];
              const position2 = buffer[i2];
              const position3 = buffer[i3];
              const position4 = buffer[i4];

              randomPool[i] = position1;
              randomPool[i2] = position2;
              randomPool[i3] = position3;
              randomPool[i4] = position4;
            }
          } else {
            const length = randomPoolSize - sizeRemaining;

            for (let i = 0; i < length; i += threads) {
              const i2 = i + 1;
              const i3 = i + 2;
              const i4 = i + 3;

              const position1 = buffer[i];
              const position2 = buffer[i2];
              const position3 = buffer[i3];
              const position4 = buffer[i4];

              randomPool[i] = position1;
              randomPool[i2] = position2;
              randomPool[i3] = position3;
              randomPool[i4] = position4;
            }

            for (let i = length; i < randomPoolSize; i++) {
              const position = buffer[i];

              randomPool[i] = position;
            }
          }
        } else {
          const bufferMask = dictionarySize - 1;

          if (sizeRemaining === 0) {
            for (let i = 0; i < randomPoolSize; i += threads) {
              const i2 = i + 1;
              const i3 = i + 2;
              const i4 = i + 3;

              const position1 = buffer[i & bufferMask];
              const position2 = buffer[i2 & bufferMask];
              const position3 = buffer[i3 & bufferMask];
              const position4 = buffer[i4 & bufferMask];

              randomPool[i & bufferMask] = position1;
              randomPool[i2 & bufferMask] = position2;
              randomPool[i3 & bufferMask] = position3;
              randomPool[i4 & bufferMask] = position4;
            }
          } else {
            const length = randomPoolSize - sizeRemaining;

            for (let i = 0; i < length; i += threads) {
              const i2 = i + 1;
              const i3 = i + 2;
              const i4 = i + 3;

              const position1 = buffer[i & bufferMask];
              const position2 = buffer[i2 & bufferMask];
              const position3 = buffer[i3 & bufferMask];
              const position4 = buffer[i4 & bufferMask];

              randomPool[i & bufferMask] = position1;
              randomPool[i2 & bufferMask] = position2;
              randomPool[i3 & bufferMask] = position3;
              randomPool[i4 & bufferMask] = position4;
            }

            for (let i = length; i < randomPoolSize; i++) {
              const position = buffer[i & bufferMask];

              randomPool[i & bufferMask] = position;
            }
          }
        }

        this.#resetRandomPoolOffset();
        return;
      }
    }

    for (let i = 0; i < randomPoolSize; i += threads) {
      const position1 = Math.random() * dictionarySize | 0;
      const position2 = Math.random() * dictionarySize | 0;
      const position3 = Math.random() * dictionarySize | 0;
      const position4 = Math.random() * dictionarySize | 0;

      randomPool[i] = position1;
      randomPool[i + 1] = position2;
      randomPool[i + 2] = position3;
      randomPool[i + 3] = position4;
    }

    this.#resetRandomPoolOffset();
  }

  #getRandomInt() {
    const randomPool = this.#randomPool;
    const randomPoolSize = this.#randomPoolSize;
    let randomPoolOffset = this.#randomPoolOffset;

    if (randomPoolOffset >= randomPoolSize) {
      this.#updateRandomPool(randomPool);
    }

    randomPoolOffset = this.#randomPoolOffset;
    this.#randomPoolOffset++;

    return randomPool[randomPoolOffset];
  }

  /**
   * @param {number} count
   */
  #getRandomInts(count) {
    const randomInts = this.#randomInts;
    if (randomInts.length !== count) {
      randomInts.length = count;
    }

    const threads = 4;
    const sizeRemaining = count % threads;

    if (sizeRemaining === 0) {
      for (let i = 0; i < count; i += threads) {
        const randomPool = this.#randomPool;
        const randomPoolSize = this.#randomPoolSize;
        let randomPoolOffset = this.#randomPoolOffset;

        if (randomPoolOffset + 3 >= randomPoolSize) {
          this.#updateRandomPool(randomPool);
        }

        randomPoolOffset = this.#randomPoolOffset;
        this.#randomPoolOffset += 4;

        randomInts[i] = randomPool[randomPoolOffset];
        randomInts[i + 1] = randomPool[randomPoolOffset + 1];
        randomInts[i + 2] = randomPool[randomPoolOffset + 2];
        randomInts[i + 3] = randomPool[randomPoolOffset + 3];
      }
    } else {
      const length = count - sizeRemaining;

      for (let i = 0; i < length; i += threads) {
        const randomPool = this.#randomPool;
        const randomPoolSize = this.#randomPoolSize;
        let randomPoolOffset = this.#randomPoolOffset;

        if (randomPoolOffset + 3 >= randomPoolSize) {
          this.#updateRandomPool(randomPool);
        }

        randomPoolOffset = this.#randomPoolOffset;
        this.#randomPoolOffset += 4;

        randomInts[i] = randomPool[randomPoolOffset];
        randomInts[i + 1] = randomPool[randomPoolOffset + 1];
        randomInts[i + 2] = randomPool[randomPoolOffset + 2];
        randomInts[i + 3] = randomPool[randomPoolOffset + 3];
      }

      for (let i = length; i < count; i++) {
        const randomPool = this.#randomPool;
        const randomPoolSize = this.#randomPoolSize;
        let randomPoolOffset = this.#randomPoolOffset;

        if (randomPoolOffset >= randomPoolSize) {
          this.#updateRandomPool(randomPool);
        }

        randomPoolOffset = this.#randomPoolOffset;
        this.#randomPoolOffset++;

        randomInts[i] = randomPool[randomPoolOffset];
      }
    }

    return randomInts;
  }
  //#endregion
}

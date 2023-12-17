/**
 * @typedef {string} Dictionary
 */

/**
 * @typedef {number[]} RandomPool
 */

/**
 * @typedef {object} IdGeneratorParams
 * @property {Crypto=} Crypto
 * @property {BufferConstructor=} Buffer
 * @property {Dictionary=} dictionary
 * @property {number=} randomPoolSize - max 65536
 */
export default class IdGenerator {
  /** @type {Crypto=} */
  #CryptoClass;
  /** @type {BufferConstructor=} */
  #BufferClass;

  /** @type {Dictionary} */
  #dictionary;

  /** @type {number} */
  #dictionarySize;

  /** @type {number} */
  #randomPoolOffset;

  /** @type {number} */
  #randomPoolSize;

  /** @type {RandomPool} */
  #randomPool;

  /** @type {Buffer=} */
  #buffer;

  /** @type {string[]} */
  #chars;

  /** @param {IdGeneratorParams} params */
  constructor({
    Crypto,
    Buffer,
    dictionary = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz',
    randomPoolSize = 128
  } = {}) {
    this.#CryptoClass = Crypto;
    this.#BufferClass = Buffer;

    if (Crypto == null && Buffer != null) {
      throw Object.assign(new Error('Crypto must be non-empty when Buffer non-empty'), {
        name: 'CryptoEmptyError'
      });
    }

    if (Crypto != null && Buffer == null) {
      throw Object.assign(new Error('Buffer must be non-empty when Crypto non-empty'), {
        name: 'BufferEmptyError'
      });
    }

    this.#dictionary = dictionary;
    this.#dictionarySize = dictionary.length;

    this.#randomPoolOffset = 0;
    this.#randomPoolSize = randomPoolSize;
    this.#randomPool = this.#createRandomPool(randomPoolSize);

    this.#chars = [];
  }

  #getCryptoClass() {
    return this.#CryptoClass;
  }

  #getBufferClass() {
    return this.#BufferClass;
  }

  #getDictionary() {
    return this.#dictionary;
  }

  #getDictionarySize() {
    return this.#dictionarySize;
  }

  /**
   * @param {number} size
   */
  #createRandomPool(size) {
    /** @type {number[]} */
    const randomPool = [];

    const Buffer = this.#getBufferClass();
    if (Buffer != null) {
      this.#buffer = Buffer.alloc(size);
    }

    this.#setRandomPoolSize(size);
    this.#updateRandomPool(randomPool);

    return randomPool;
  }

  #getRandomPool() {
    return this.#randomPool;
  }

  #getRandomPoolOffset() {
    return this.#randomPoolOffset;
  }

  #incrementRandomPoolOffset() {
    this.#randomPoolOffset++;
  }

  #resetRandomPoolOffset() {
    this.#randomPoolOffset = 0;
  }

  #getRandomPoolSize() {
    return this.#randomPoolSize;
  }

  /**
   * @param {number} size
   */
  #setRandomPoolSize(size) {
    this.#randomPoolSize = size;
  }

  /**
   * @param {RandomPool} randomPool
   */
  #updateRandomPool(randomPool) {
    const crypto = this.#getCryptoClass();

    const randomPoolSize = this.#getRandomPoolSize();
    const dictionarySize = this.#getDictionarySize();

    if (crypto != null) {
      const buffer = this.#getBuffer();
      if (buffer != null) {
        crypto?.getRandomValues(buffer);

        const bufferMask = dictionarySize - 1;

        for (let i = randomPoolSize; i--;) {
          randomPool[i] = buffer[i] & bufferMask;
        }

        this.#resetRandomPoolOffset();
        return;
      }
    }

    for (let i = randomPoolSize; i--;) {
      randomPool[i] = Math.random() * dictionarySize | 0;
    }

    this.#resetRandomPoolOffset();
  }

  #getBuffer() {
    return this.#buffer;
  }

  #getRandomInt() {
    const randomPool = this.#getRandomPool();
    const randomPoolSize = this.#getRandomPoolSize();
    let randomPoolOffset = this.#getRandomPoolOffset();

    if (randomPoolOffset >= randomPoolSize) {
      this.#updateRandomPool(randomPool);
    }

    randomPoolOffset = this.#getRandomPoolOffset();
    this.#incrementRandomPoolOffset();

    return randomPool[randomPoolOffset];
  }

  /**
   * @param {number=} size
   */
  create(size = 22) {
    if (size < 1) {
      return '';
    }

    const dictionary = this.#getDictionary();

    const chars = this.#chars;

    for (let i = size; i--;) {
      const position = this.#getRandomInt();

      const char = dictionary[position];

      chars[i] = char;
    }

    return chars.join('');
  }
}

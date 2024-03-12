# IdGenerator
IdGenerator

1) [Features](#features);
2) [Usage](#usage):
  1) [Prepare](#prepare):
    1) [Create id generator](#create-id-generator):
      1) [Unsafe](#unsafe);
      2) [Safe](#safe);
      3) [Dictionary and random pool size](#dictionary-and-random-pool-size).
  2) [Commands](#commands):
    1) [Create](#create).

## Features
1) Unlimited id size;
2) Configurable random pool size;
3) Replacable dictionary;
4) Support replacable Crypto (requires Buffer);
5) Fallback to Math.random (if Crypto & Buffer not used).

## Usage

### Prepare
```js
import { IdGenerator } 'mainid';
```

#### Create id generator
##### Unsafe
Math.random for random
```js
const idGenerator = new IdGenerator();
```

##### Safe
- Crypto - usage: `crypto.getRandomValues(buffer)`;
- Buffer is required - usage: `buffer = buffer.alloc(randomPoolSize)`.

```js
const idGenerator = new IdGenerator({
  crypto: /** @type {Crypto} */ (crypto)
});
```

##### Dictionary and random pool size
Optinal.

```js
const idGenerator = new IdGenerator({
  dictionary: 'abc',
  randomPoolSize: 3
});
```

### Commands
1) [Create](#create);

#### Create
```js
const id = idGenerator.create();
```

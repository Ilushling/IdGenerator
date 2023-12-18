# IdGenerator
IdGenerator

- [Features](#features).
- [Usage](#usage).

## Features
1) Unlimited id size;
2) Configurable random pool size;
3) Replacable dictionary;
4) Support replacable Crypto (requires Buffer);
5) Fallback to Math.random (if Crypto & Buffer not used).

## Usage
1) [Prepare](#prepare);
2) [Commands](#commands);

### Prepare
1) [Create id generator](#create-id-generator);

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
  Crypto: /** @type {Crypto} */ (crypto),
  Buffer
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

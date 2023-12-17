# IdGenerator
IdGenerator

- [Usage](#usage).

## Usage
1) [Prepare](#prepare);
2) [Commands](#commands);

### Prepare
1) [Create id generator](#create-id-generator);

#### Create id generator
##### Unsafe
```js
const idGenerator = new IdGenerator();
```
##### Safe
```js
const idGenerator = new IdGenerator({
  Crypto: /** @type {Crypto} */ (crypto),
  Buffer
});
```

### Commands
1) [Create](#create);

#### Create
```js
const id = idGenerator.create();
```
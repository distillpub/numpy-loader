# numpy-loader
A webpack loader for binary numpy .npy files

Returns a callback that is called with an ndarray.

## Usage

Configure the loader in your `webpack.config.js` under `module` > `rules`, e.g. like this:

```js
{
  test: /\.(npy|npc)$/,
  exclude: /node_modules/,
  loader: 'numpy-loader',
  options: {
    outputPath: 'assets/data'
  }
}
```

For now this package assumes your file is too large to be included in the webpack bundle and thus we leave it as a binary file. You can specify an `outputPath` that will be used during compilation.

You can now load `.npy` files as `ndarray`s in your JS code simply by `require`ing it:

```js
const npyarray = require("./data/array_uint8.npy")

npyarray.load( (array) => {
  console.log("Loaded an .npy array in JS!");
  console.log(array);
})

```

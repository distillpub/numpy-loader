const assert = require('assert'),
      loaderUtils = require('loader-utils'),
      path = require('path');

module.exports = function(content) {
  console.log('Distill Numpy Loader says "Hi"! \\o/');

  // TODO: optionally base64 encode and embed in webpack js file
  // for now copy npy file to outputPath
  const options = loaderUtils.getOptions(this) || {};
  const pathToNPY = this.resourcePath;
  const fileName = path.basename(pathToNPY);
  const outputPath = path.join(options.outputPath, fileName);
  this.emitFile(outputPath, content);

  // create runtime
  const absoluteNumpyParserPath = require.resolve('numpy-parser')
  const relativeNumpyParserPath = loaderUtils.stringifyRequest(this, "!" + absoluteNumpyParserPath);

  return `
  const NumpyParser = require(${relativeNumpyParserPath});
  const NDArray = require("ndarray");

  function ajax(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function(e) {
          var buffer = xhr.response; // not responseText
          var result = NumpyParser.fromArrayBuffer(buffer);
          callback(result);
      };
      xhr.open("GET", url, true);
      xhr.responseType = "arraybuffer";
      xhr.send(null);
  }

  module.exports = {
    load: function(callback) {
      ajax("${outputPath}", function(data) {
        const result = NDArray(data.data, data.shape);
        callback(result);
      });
    }
  };
  `;
};
module.exports.raw = true;

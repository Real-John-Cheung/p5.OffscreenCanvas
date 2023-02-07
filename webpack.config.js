const path = require('path');

module.exports = {
    entry: './src/p5.OffscreenCanvas.js',
    output: {
        path: path.resolve(__dirname, 'docs/dist'),
        filename: 'p5.OffscreenCanvas.js',
        globalObject: 'this',
        library: 'p5.OffscreenCanvas',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    }
}
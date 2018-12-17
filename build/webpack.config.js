const path = require('path')

module.exports = {
  entry: path.join(__dirname, '../src/index'),
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'weapp-pixi-adapter.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader',
          'eslint-loader'
        ]
      }
    ]
  },
  devtool: 'source-map'
}

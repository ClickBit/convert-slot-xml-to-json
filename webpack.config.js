var webpack = require('webpack')
var plugins = require('webpack-load-plugins')();
module.exports = {
  entry: "./index.js",
  output: {
    path: __dirname + '/build',
    filename: "index.js",
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
      mangle: false,
      output: {
        comments: false
      },
      compressor: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  devtool: 'source-map'
}
var pkg = require('./package.json')
var os = require("os")
var webpack = require('webpack')
var plugins = require('webpack-load-plugins')();
var WrapperPlugin = require('wrapper-webpack-plugin');
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
    }),
    new WrapperPlugin({
      header: `/*!
 * ${pkg.name}
 * ${pkg.description}
 * compiled at ${os.hostname()} ${new Date()}
 */
`
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
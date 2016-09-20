module.exports = {
  entry: "./index.js",
  output: {
    path: __dirname + '/build',
    filename: "index.js",
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
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
module.exports = {
  entry: './src/server.ts',
  output: {
    filename: 'dist/server.js',
    target: 'node',
    library: true, // Not name since it creates substructure
    libraryTarget: 'commonjs2' // must be exactly this to generate correct library
  },
  externals: {
      "crypto": "crypto"
  },
  node: {
      Buffer: false, // do not polyfill buffer
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx', '']
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  }
}
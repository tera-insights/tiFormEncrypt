module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'dist/tiForms.js',
    libraryTarget: "var",
    library: "tiForms"
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
      },
      {
        test: /\.json$/, 
        loader: "json-loader"
      }
    ]
  }
}
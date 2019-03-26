module.exports = {
  entry: './src/index.ts',
  output: {
    filename: './dist/tiForms.js',
    libraryTarget: "var",
    library: "tiForms"
  },
  mode: "production",
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  }
}
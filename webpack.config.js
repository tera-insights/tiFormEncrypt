module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "tiForms.min.js", // implicitly in the "dist" directory
    libraryTarget: "var",
    library: "tiForms"
  },
  mode: "production",
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      }
    ]
  }
}
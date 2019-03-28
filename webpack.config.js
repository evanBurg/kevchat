let webpack = require("webpack");
let path = require("path");

module.exports = {
  node: {
    fs: "empty"
  },
  entry: {
    home: "./src/front_end/home.js",
  },
  output: {
    path: path.resolve(__dirname, "public/js"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  }
};

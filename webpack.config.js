let webpack = require("webpack");
let path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  node: {
    fs: "empty"
  },
  entry: {
    home: "./src/front_end/home.js"
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
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Production"
    })
  ],
  resolve: {
    extensions: [".js", ".jsx"]
  }
};

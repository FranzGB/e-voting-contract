const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');

module.exports = {
    entry: "./src/index.tsx",
    output: {
        path: path.join(__dirname, "build"),
        filename: "index.bundle.js",
        publicPath: 'auto'
        },
    mode: process.env.NODE_ENV || "development",
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        fallback: { "crypto": require.resolve("crypto-browserify"),
                    "os": require.resolve("os-browserify/browser"),
                    "stream": require.resolve("stream-browserify"),
                    "http": require.resolve("stream-http"),
                    "https": require.resolve("https-browserify"),
                    "buffer": require.resolve("buffer")}
    },
    devServer: { static: path.join(__dirname, "src") },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: ["ts-loader"],
            },
            {
                test: /\.(css|scss)$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
                use: ["file-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "index.html"),
            favicon: path.join(__dirname, "public", "favicon.ico")
        }),
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
      }),
    ],

};

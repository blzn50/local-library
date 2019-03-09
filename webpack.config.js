const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const outputDirectory = 'dist';
const VENDOR_LIBS = ['react', 'react-dom', 'react-router-dom'];

module.exports = {
  entry: {
    bundle: ['babel-polyfill', './client/index.js'],
    vendor: VENDOR_LIBS,
  },
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.s?css$/,
        loader: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|woff|woff2|eot|ttf|svg)$/i,
        loader: 'url-loader?limit=100000',
      },
    ],
  },
  devServer: {
    port: 3000,
    // open: true,
    historyApiFallback: true,
    proxy: {
      '/catalog': 'http://localhost:5000',
      '/users': 'http://localhost:5000',
    },
  },
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new MomentLocalesPlugin(),

    // Or: To strip all locales except “en”, “es-us” and “ru”
    // (“en” is built into Moment and can’t be removed)
    // new MomentLocalesPlugin({
    //     localesToKeep: ['es-us', 'ru'],
    // }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '.',
    },
  },
};

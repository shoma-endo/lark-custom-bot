const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const WebpackBar = require('webpackbar');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  getBaseConfig: (packageRoot) => ({
    entry: path.resolve(packageRoot, 'src/index.tsx'),
    output: {
      path: path.resolve(packageRoot, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true,
    },
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
      alias: {
        '@': path.resolve(packageRoot, 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2020',
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
        {
          test: /\.less$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(packageRoot, 'public/index.html'),
        favicon: path.resolve(packageRoot, 'public/favicon.ico'),
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
      ...(isDevelopment ? [new ReactRefreshWebpackPlugin()] : []),
      new WebpackBar(),
    ],
    devServer: isDevelopment
      ? {
          hot: true,
          historyApiFallback: true,
          port: 3000,
          open: true,
          static: {
            directory: path.resolve(packageRoot, 'public'),
          },
        }
      : undefined,
  }),
}; 
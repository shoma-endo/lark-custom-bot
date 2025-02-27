// packages/record-view/config/webpack.config.js
const path = require('path');
const { getBaseConfig } = require('@lark-plugins/webpack-config');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const packageRoot = path.resolve(__dirname, '..');
const baseConfig = getBaseConfig(packageRoot);

// 完全に新しいconfigを作成して上書き
module.exports = {
  ...baseConfig,
  plugins: baseConfig.plugins.filter(plugin => 
    plugin.constructor.name !== 'HtmlWebpackPlugin'
  ).concat([
    new HtmlWebpackPlugin({
      template: path.resolve(packageRoot, 'public/index.html'),
      // faviconなし
    })
  ])
};
import path from 'path';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import type { Configuration } from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";

const postcssConfig = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      ident: 'postcss',
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
    sourceMap: true,
  },
}

const devServer: DevServerConfiguration = {
  hot: false,
  static: {
    directory: path.join(__dirname, 'public'),
  },
  historyApiFallback: true,
  compress: true,
  port: 3000,
  allowedHosts: ['localhost', '127.0.0.1'],
};
const config = (env: { [key: string]: unknown }): Configuration => {
  const isProduction = env.production

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.tsx',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new ReactRefreshWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
      }),
    ],
    devServer,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                plugins: [require.resolve('react-refresh/babel')].filter(
                  Boolean
                ),
              },
            },
          ],
        },
        { test: /\.ts|.tsx$/, exclude: /node_modules/, use: ['ts-loader'] },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader', postcssConfig],
        },
        {
          test: /\.s[ac]ss$/i,
          use: ['style-loader', 'css-loader', postcssConfig, 'sass-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'],
    },
    devtool: isProduction ? false : 'inline-source-map',
  }
}
export default config
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const DEVELOPMENT_MODE = 'development';
const PRODUCTION_MODE = 'production';
const isProduction =
  process.argv.indexOf('production') >= 0 || process.env.NODE_ENV === PRODUCTION_MODE;

const SRC_PATH = path.join(__dirname, './src');
const DIST_PATH = path.join(__dirname, './build');

module.exports = {
  context: SRC_PATH,
  entry: ['react-hot-loader/patch', './index.tsx'],
  output: {
    filename: 'js/app.bundle.js',
    publicPath: '/',
    path: DIST_PATH,
  },
  mode: isProduction ? PRODUCTION_MODE : DEVELOPMENT_MODE,
  target: 'web',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    mainFields: ['module', 'browser', 'main'],
    alias: {
      '~': path.resolve(__dirname, SRC_PATH),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          !isProduction && {
            loader: 'babel-loader',
            options: { plugins: ['react-hot-loader/babel'] },
          },
          'ts-loader',
        ].filter(Boolean),
      },
      {
        test: /\.scss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: isProduction ? '[hash:base64:5]' : '[local]__[hash:base64:5]',
              },
              sourceMap: !isProduction,
              importLoaders: 1,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg|woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: '**/*',
          context: path.join(__dirname, './public'),
          to: DIST_PATH,
        },
      ],
    }),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new SVGSpritemapPlugin('src/view/assets/icons/*.svg', {
      output: {
        svgo: {
          plugins: [
            {
              name: 'convertColors',
              params: {
                currentColor: true,
              },
            },
          ],
        },
      },
    }),
    new HtmlWebpackPlugin({
      title: 'Timbyr.tech',
      template: `${__dirname}/template.html`,
      filename: 'index.html',
    }),
    new Dotenv({
      systemvars: true,
      safe: true,
    }),
    new ESLintPlugin({
      extensions: ['.ts', '.tsx'],
      failOnError: false,
    }),
  ],
};

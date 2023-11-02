const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const stylesHandler = MiniCssExtractPlugin.loader;
const ExposeRuntimeCssAssetsPlugin = require('single-spa-css/ExposeRuntimeCssAssetsPlugin.cjs');


module.exports = (webpackConfigEnv, argv) => {
  const orgName = "vivienda";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "root-config",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new ExposeRuntimeCssAssetsPlugin({
        // The filename here must match the filename for the MiniCssExtractPlugin
        filename: '[name].css'
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          orgName,
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [stylesHandler, 'css-loader']
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            stylesHandler,
            'css-loader',
            'resolve-url-loader',
            'sass-loader'
          ]
        }
      ]
    }
  });
};

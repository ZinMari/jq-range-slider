import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import { BuildOptions } from "./types/types";

export function buildPlaguins({
  mode,
  paths,
}: BuildOptions): webpack.Configuration["plugins"] {
  const isDev = mode === "development";
  const isProd = mode === "production";
  const plugins: webpack.Configuration["plugins"] = [
    new HtmlWebpackPlugin({
      template: paths.html,
    }),
  ];

  if (isDev) {
    plugins.push(
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      }),
    );
  }
  if (isProd) {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash:8].css",
        chunkFilename: "css/[name].[contenthash:8].css",
      }),
      new FaviconsWebpackPlugin({
        logo: './src/page/favicon.png',
        mode: 'webapp',
        devMode: 'webapp',
        prefix: 'assets/favicons/',
        cache: true,
        inject: htmlPlugin => {
          return true
        },
        favicons: {
          background: '#fff',
          theme_color: '#333'
        }
      }),
    );
  }
  return plugins;
}

// import path from 'path';
// import webpack from 'webpack';
// import HtmlWebpackPlugin from 'html-webpack-plugin';
// import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
// import MiniCssExtractPlugin from "mini-css-extract-plugin";

// type Mode = 'production' | 'development';

// interface EnvVariables {
//     mode: Mode;
//     port: number;
// }

// export default(env: EnvVariables) => {
//     const isDev = env.mode === 'development';

//     const config: webpack.Configuration = {
//         mode: env.mode ?? 'development',
//         entry: path.resolve(__dirname, 'src', 'jquery.alexandr.js'),
//         output: {
//             path: path.resolve(__dirname, 'build'),
//             filename: 'bundle.[contenthash:2].js',
//             clean: true,
//         },
//         plugins: [
//             new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src', 'index.html') }),
//             new MiniCssExtractPlugin({
//                 filename: 'css/[name].[contenthash:2].css',
//                 chunkFilename: 'css/[name].[contenthash:2].css',
//             }),
//             new webpack.ProvidePlugin({
//                 $: 'jquery',
//                 jQuery: 'jquery',
//             }),
//         ],
//         module: {
//             rules: [
//               {
//                 test: /\.tsx?$/,
//                 use: 'ts-loader',
//                 exclude: /node_modules/,
//               },
//               {
//                 test: /\.s[ac]ss$/i,
//                 use: [
//                     MiniCssExtractPlugin.loader,
//                     "css-loader",
//                     "sass-loader",
//                 ],
//               },
//             ],
//           },
//           resolve: {
//             extensions: ['.tsx', '.ts', '.js'],
//         },
//         devtool: isDev ? 'inline-source-map' : false,
//         devServer: isDev ? {
//             port: env.port ?? 3000,
//             open: true,
//         } : undefined,
//     }
//     return config;
// }

import path from 'path';
import { buildWebpack } from './config/build/buildWebpack';
import { BuildMode, BuildPaths } from './config/build/types/types';
import webpack from 'webpack';

interface EnvVariables {
  mode: BuildMode;
  port: number;
}

export default (env: EnvVariables) => {
  const paths: BuildPaths = {
    output: path.resolve(__dirname, 'build'),
    entry: path.resolve(__dirname, 'src', 'jquery.alexandr.ts'),
    html: path.resolve(__dirname, 'src', 'index.html'),
  };
  const config: webpack.Configuration = buildWebpack({
    port: env.port ?? 3000,
    mode: env.mode ?? 'development',
    paths,
  });
  return config;
};

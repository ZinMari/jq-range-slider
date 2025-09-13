import path from "path";
import { buildWebpack } from "./config/build/buildWebpack";
import { BuildMode, BuildPaths } from "./config/build/types/types";
import webpack from "webpack";

interface EnvVariables {
  mode: BuildMode;
  port: number;
}

export default (env: EnvVariables) => {
  const paths: BuildPaths = {
    output: path.resolve(__dirname, "build"),
    entry: {
      "jquery.slider": path.resolve(
        __dirname,
        "src",
        "slider",
        "jquery.slider.ts",
      ),
      index: path.resolve(__dirname, "src", "page", "index.ts"),
    },
    html: path.resolve(__dirname, "src", "page", "index.pug"),
  };
  const config: webpack.Configuration = buildWebpack({
    port: env.port ?? 3000,
    mode: env.mode ?? "development",
    paths,
  });
  return config;
};

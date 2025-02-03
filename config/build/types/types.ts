export interface BuildPaths {
  entry: any;
  html: string;
  output: string;
}

export type BuildMode = 'production' | 'development';

export interface BuildOptions {
  port: number;
  paths: BuildPaths;
  mode: BuildMode;
}

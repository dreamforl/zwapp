import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";
import { version } from "./package.json";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
const banner =
  "/*!\n" +
  ` * tools v${version}\n` +
  ` * (c) 2022-${new Date().getFullYear()} zhenwei\n` +
  " * Released under the MIT License.\n" +
  " */";

export default {
  input: "lib/index.ts",
  output: [
    {
      file: "dist/index.umd.js",
      format: "umd",
      name: "zwapp",
      banner,
      sourcemap: true,
      exports: "named",
    },
    {
      file: "dist/index.js",
      format: "es",
      name: "zwapp",
      banner,
      sourcemap: true,
      exports: "named",
    },
  ],
  plugins: [
    resolve({
      extensions: [".js", ".ts"],
    }),
    json(),
    typescript({
      tsconfig: "./tsconfig.json",
      // declaration: true,
      // declarationDir: "./dist/types",
      rootDir: "./lib",
      outDir: "./dist",
    }),
    babel({
      exclude: "node_modules/**",
      extensions: [".ts", ".tsx"],
      babelHelpers: "bundled",
    }),
    terser({
      compress: {
        // drop_console: true //关闭console
      },
    }),
  ],
};

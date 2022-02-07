import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";
export default {
  input: "src/index.js",
  output: {
    file: "dist/index.js",
    format: "umd",
    name: "zwapp", //暴露全局变量为zwapp
  },
  plugins: [
    babel({
      exclude: "node_modules/**",
    }),
    terser({
      compress: {
        // drop_console: true //关闭console
      },
    }),
    serve({
      contentBase: "./dist", //服务器启动的文件夹，默认是项目根目录，需要在该文件下创建index.html
      // port: 8020, //端口号，默认10001
    }),
    livereload("dist"),
  ],
};

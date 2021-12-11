import {
  terser
} from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'zwapp', //暴露全局变量为zwapp
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    terser({
      compress: {
        // drop_console: true //关闭console
      }
    }),

  ],

}
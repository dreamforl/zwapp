import { defineConfig } from "vite";
import { resolve } from "path";
import zwappPlugin from 'vite-plugin-zwapp'
// https://vitejs.dev/config/
export default defineConfig(({}) => {
  return {
    base: "/",
    plugins: [zwappPlugin()],
    resolve: {
      alias: [
        {
          find: "zwapp",
          replacement: resolve(__dirname, "../lib/index.ts"),
        },
        {
          find: "@",
          replacement: resolve(__dirname, "src"),
        },
        {
          find: "@components",
          replacement: resolve(__dirname, "src/components"),
        },
        {
          find: "@utils",
          replacement: resolve(__dirname, "src/utils"),
        },
        {
          find: "@hooks",
          replacement: resolve(__dirname, "src/hooks"),
        },
        {
          find: "@data",
          replacement: resolve(__dirname, "src/data"),
        }
      ],
    },
    server: {
      port: 7778,
      host: "0.0.0.0",
    },
    css: {
      modules: {
        localsConvention: "camelCase",
        generateScopedName: "[local]_[hash:base64:5]",
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  };
});

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: true,
    rollupOptions: {
      output: {
        format: "es",
      },
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
});
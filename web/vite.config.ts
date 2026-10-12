import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    // three.js is its own lazy chunk (only fetched near the fitting room), so its size is expected
    chunkSizeWarningLimit: 800,
    // the main page, /about/, and one page per article (each has its own link-preview tags)
    rolldownOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about/index.html"),
        kestrel: resolve(__dirname, "writing/kestrel/index.html"),
      },
    },
  },
});

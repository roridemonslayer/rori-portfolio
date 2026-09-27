import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    // three.js is its own lazy chunk (only fetched near the fitting room), so its size is expected
    chunkSizeWarningLimit: 800,
    // two pages: the main page and /about/
    rolldownOptions: { input: { main: resolve(__dirname, "index.html"), about: resolve(__dirname, "about/index.html") } },
  },
});

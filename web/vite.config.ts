import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // three.js is its own lazy chunk (only fetched near the fitting room), so its size is expected
  build: { chunkSizeWarningLimit: 800 },
});

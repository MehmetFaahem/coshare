import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  base: "/",
  server: {
    port: 3000,
    open: true,
    proxy: {}, // Remove any conflicting proxies if they exist
  },
  preview: {
    port: 3000,
    open: true,
  },
});

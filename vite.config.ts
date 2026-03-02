import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  root: ".", // 👈 Your main folder (attendease)
  publicDir: "public",
  server: {
    host: "::",
    port: 8080,
    open: "/dashboard.html", // 👈 Automatically open dashboard.html
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000", // 👈 Flask backend (port 5000)
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
}));

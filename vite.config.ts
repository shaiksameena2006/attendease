import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  root: "attendease", // 👈 tell Vite to look in inner folder
  server: {
    host: "127.0.0.1",
    port: 8080,
    open: "/dashboard.html", // 👈 open your renamed HTML file
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000", // Flask backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "attendease/src"),
    },
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "attendease/dashboard.html"),
    },
  },
});

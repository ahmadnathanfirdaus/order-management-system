import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.VITE_HOST || "127.0.0.1",
    port: Number(process.env.VITE_PORT || 5173),
  },
  preview: {
    host: process.env.VITE_HOST || "127.0.0.1",
    port: Number(process.env.VITE_PORT || 5173),
  },
});

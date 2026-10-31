import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_PROXY_TARGET || env.VITE_API_PROXY_TARGET || "http://localhost:8080";
  const isDocker = env.DOCKER === "true" || process.env.DOCKER === "true";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: false,
      hmr: {
        host: "localhost",
        clientPort: 5173,
      },
      watch: isDocker ? { usePolling: true, interval: 1000 } : undefined,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      host: "0.0.0.0",
      port: 4173,
    },
  };
});

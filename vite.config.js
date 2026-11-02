import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // "prompt" pairs with useRegisterSW in UpdatePrompt.jsx.
      // injectRegister: null is required because we use the virtual module.
      registerType: "prompt",
      injectRegister: null,
      includeAssets: [
        "favicon/favicon.ico",
        "favicon/apple-touch-icon.png",
        "favicon/logo-icon.png",
      ],
      manifest: {
        name: "Whiskerly",
        short_name: "Whiskerly",
        description:
          "AI-assisted productivity workspace for tasks, kanban boards, daily planning, focus sessions and analytics.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#faf8f5",
        theme_color: "#5648d9",
        lang: "fa",
        dir: "rtl",
        categories: ["productivity", "utilities"],
        icons: [
          {
            src: "/favicon/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/favicon/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,svg,woff2}",
          "favicon/web-app-manifest-*.png",
        ],
        globIgnores: [
          "**/favicon/logo-*.png",
          "**/favicon/favicon.svg",
          "**/backgrounds/**",
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/openrouter": {
        target: "https://openrouter.ai",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openrouter/, "/api/v1"),
      },
    },
  },
});

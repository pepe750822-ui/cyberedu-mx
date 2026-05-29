import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      registerType: "autoUpdate",
      injectRegister: null, // registro manual ya existe en index.html
      includeAssets: ["favicon.ico", "icons/*.png"],
      manifest: false, // ya tenemos public/manifest.json
      injectManifest: {
        globPatterns: ["assets/**/*.{js,css,woff2}", "*.{html,ico}"],
        globIgnores: [
          "**/videos/**",
          "**/ecoems2026/**",
          "**/ingles/**",
          "**/guia2026/**",
          "**/mermaid-*.js",
          "**/*spline*",
          "**/neuralbraincanvas*",
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2020',
    outDir: "dist",
    sourcemap: mode === 'development',
    minify: 'esbuild',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('mermaid')) {
            return 'mermaid';
          }
        },
      },
    },
  },
}));

// force redeploy 2026-04-25

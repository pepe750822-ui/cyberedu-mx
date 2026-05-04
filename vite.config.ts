import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  define: {
    'Object.hasOwn': 'Object.hasOwn || ((obj, key) => Object.prototype.hasOwnProperty.call(obj, key))',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2015',
    outDir: "dist",
    sourcemap: mode === 'development',
    minify: 'esbuild',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@react-three/fiber') || id.includes('@react-three/drei') || id.includes('three/')) {
            return 'three';
          }
          if (id.includes('mermaid')) {
            return 'mermaid';
          }
        },
      },
    },
  },
}));

// force redeploy 2026-04-25

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
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    // Auto-inject React and common hooks to prevent ReferenceErrors in production
    jsxInject: `import React, { useState, useEffect, useCallback, useMemo } from 'react';`
  },
  build: {
    target: 'es2020',
    outDir: "dist",
    sourcemap: mode === 'development',
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
  },
}));
